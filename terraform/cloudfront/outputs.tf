output "master_feature_cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.master_feature_distribution.id
}

output "features_cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.features_distribution.id
}