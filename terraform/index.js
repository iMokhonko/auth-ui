const fs = require('fs').promises;
const path = require('path');
const mime = require('mime-types');
const { spawn } = require('child_process');

const runCliCommand = async ({ cmd, args }) => {
	return new Promise(resolve => {
		const process = spawn(cmd, args);
    
		process.stdout.on('data', data => console.log(`${data}`));
		process.stderr.on('data', data => console.error(`${data}`));

		process.on('exit', resolve);
	});
}

const uploadFile = async ({ filePath, s3, bucketName, bucketPrefix }) => {
  const fileContent = await fs.readFile(filePath);

  const params = {
      Bucket: bucketName,
      Key: `${bucketPrefix}/${filePath.replace('dist/', '')}`, 
      Body: fileContent,
      ContentType: mime.lookup(filePath)
  };

  await s3.upload(params).promise();
  console.log(`File uploaded successfully to ${filePath.replace('dist', `${bucketName}/${bucketPrefix}`)}`);
}

const uploadDir = async ({ dirPath, s3, bucketName, bucketPrefix }) => {
  const files = await fs.readdir(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);
    
    if (stats.isFile()) {
      await uploadFile({ 
        filePath, 
        s3, 
        bucketName, 
        bucketPrefix 
      });
    } else if (stats.isDirectory()){
      await uploadDir({ 
        dirPath: filePath, 
        s3, bucketName, 
        bucketPrefix, 
      });
    }
  } 
}

module.exports = ({
  serviceName: 'Auth UI',

  config: {
    env: 'dev', // infrastructure environment
    hostedZone: 'imokhonko.com', // hosted zone where DNS records will be created
    subdomain: 'auth', // service subdomain
  },

  aws: {
    region: 'us-east-1', // aws region
    profile: 'default', // aws credentials profile in .aws/credentials file
  },

  terraformBackend: {
    serviceName: 'auth-ui', // backend service name
    bucket: 'tf-state-backend-imokhonko', // aws bucket name where tfstate files will be stored
    region: 'us-east-1' // bucket region in aws
  },

  terraformResources: [
    {
      // Create dns records in route 53 for service and create ACM certificates
      folderName: 'dns',
      outputName: 'dns',

      global: true
    },

    // Create record in aws parameter store and save DNS address of deployed service
    {
      folderName: "config",
      outputName: "config",
  
      global: true
    },

    // Create S3 bucket for application build for current env & feature
    {
      folderName: "s3",
      outputName: "s3",

      global: true
    },

    // Create distribution for s3 bucket with app build for current env & feature
    {
      folderName: "cloudfront",
      outputName: "distribution",

      global: true
    },
  ],

  deploy: async ({ feature, infrastructure, AWS }) => {
    const cloudfront = new AWS.CloudFront({ apiVersion: '2019-03-26' });  
    
    await runCliCommand({
      cmd: 'npm',
      args: ['run', 'build']
    })

    await uploadDir({
      dirPath: 'dist', 
      bucketName: infrastructure.s3.s3_bucket_name, 
      bucketPrefix: feature,
      s3: new AWS.S3({ apiVersion: '2006-03-01' })
    });

    const distribtuionId = feature === 'master'
      ? infrastructure.distribution.master_feature_cloudfront_distribution_id
      : infrastructure.distribution.features_cloudfront_distribution_id

    await cloudfront.createInvalidation({
      DistributionId: distribtuionId,
      InvalidationBatch: {
          CallerReference: '' + (new Date().getTime()), 
          Paths: {
              Quantity: 1,
              Items: feature === 'master' ? [`/*`] : [`/${feature}/*`]
        }
      }
    }).promise();
  }
});