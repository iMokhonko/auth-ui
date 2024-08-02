const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');
const { spawn } = require('child_process');

const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const  { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront');

const runCliCommand = async ({ cmd, args }) => {
	return new Promise(resolve => {
		const process = spawn(cmd, args);
    
		process.stdout.on('data', data => console.log(`${data}`));
		process.stderr.on('data', data => console.error(`${data}`));

		process.on('exit', resolve);
	});
}

const uploadFile = async ({ filePath, s3Client, bucketName, bucketPrefix }) => {
  const commandParams = {
    Bucket: bucketName,
    Key: `${bucketPrefix}/${filePath.replace('dist/', '')}`,
    Body: await fs.readFile(filePath),
    ContentType: mime.lookup(filePath)
  };

  const command = new PutObjectCommand(commandParams);
  await s3Client.send(command);

  console.log(`File uploaded successfully to ${filePath.replace('dist', `${bucketName}/${bucketPrefix}`)}`);
}

const uploadDir = async ({ dirPath, s3Client, bucketName, bucketPrefix }) => {
  const files = await fs.readdir(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);
    
    if (stats.isFile()) {
      await uploadFile({ 
        filePath, 
        s3Client, 
        bucketName, 
        bucketPrefix 
      });
    } else if (stats.isDirectory()){
      await uploadDir({ 
        dirPath: filePath, 
        s3Client, 
        bucketName, 
        bucketPrefix, 
      });
    }
  } 
}

const clearDir = async ({ s3Client, bucketName, bucketPrefix }) => {
  try {
    const listObjectsCommand = new ListObjectsV2Command({ Bucket: bucketName, Prefix: bucketPrefix });
    const listedObjects = await s3Client.send(listObjectsCommand);

    if (listedObjects.Contents.length === 0) return;

    const deleteObjectsCommandParams = { 
      Bucket: bucketName,
      Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
      deleteObjectsCommandParams.Delete.Objects.push({ Key });
    });

    deleteObjectsCommandParams.Delete.Objects.push({ Key: `${bucketPrefix}/` });

    const deleteObjectsCommand = new DeleteObjectsCommand(deleteObjectsCommandParams);
    await s3Client.send(deleteObjectsCommand);

    if (listedObjects.IsTruncated) await clearDir({ s3Client, bucketName, bucketPrefix });
  } catch (e) {
    console.error(e);
  }
};

module.exports = ({
  serviceName: 'Auth UI',

  terraformBackendConfiguration: {
    serviceName: 'auth-ui',
    bucket: 'tfstate-floor13',
    region: 'eu-central-1'
  },

  awsConfiguration: {
    region: 'eu-central-1',
    profile: 'default',
  },
  
  config: {
    hostedZone: 'imokhonko.com',
    subdomain: 'auth',
  },

  deploy: async ({ feature, infrastructure }) => {
    const s3Client = new S3Client({ region: 'eu-central-1' });
    const cloudFrontClient = new CloudFrontClient({ apiVersion: '2019-03-26' });
    
    await Promise.all([
      // instal dependencies
      runCliCommand({
        cmd: 'pnpm',
        args: ['i']
      }),

      // build project
      runCliCommand({
        cmd: 'pnpm',
        args: ['run', 'build']
      }),

       // clear old files in bucket for this feature
      clearDir({
        s3Client,
        bucketName: infrastructure.globalResources.s3.bucketName, 
        bucketPrefix: feature,
      })
    ]);

    await uploadDir({
      dirPath: 'dist', 
      bucketName: infrastructure.globalResources.s3.bucketName, 
      bucketPrefix: feature,
      s3Client
    });

    const distributionId = feature === 'master'
      ? infrastructure.globalResources.cloudfront.masterFeatureDistributionId
      : infrastructure.globalResources.cloudfront.featuresDistributionId

    const createInvalidationCommandParams = {
      DistributionId: distributionId,
      InvalidationBatch: {
        CallerReference: '' + (new Date().getTime()), 
        Paths: {
          Quantity: 1,
          Items: feature === 'master' ? [`/*`] : [`/${feature}/*`]
        }
      }
    };

    const createInvalidationCommand = new CreateInvalidationCommand(createInvalidationCommandParams);

    await cloudFrontClient.send(createInvalidationCommand)
  },
});