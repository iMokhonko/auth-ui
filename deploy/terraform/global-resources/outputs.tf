output "dns" {
  value = {
    acmMasterCertificateArn = aws_acm_certificate.master_certificate.arn
    acmFeaturesCertificateArn = var.env != "prod" ? aws_acm_certificate.features_certificate[0].arn : null
    dnsAddress = "${local.hosted_zone_name}.${var.config.hostedZone}"
    route53ZoneId = data.aws_route53_zone.primary.id
  }
}

output "s3" {
  value = {
    bucketArn = module.s3_bucket.s3_bucket_arn
    bucketDomainName = module.s3_bucket.s3_bucket_bucket_domain_name
    bucketName = module.s3_bucket.s3_bucket_id
  }
}

output "cloudfront" {
  value = {
    featuresDistributionId = var.env != "prod" ? aws_cloudfront_distribution.features_distribution[0].id : null
    masterFeatureDistributionId = aws_cloudfront_distribution.master_feature_distribution.id
  }
}