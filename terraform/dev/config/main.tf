resource "aws_ssm_parameter" "foo" {
  name  = "/${var.env}/${var.dns_service_name}"
  type  = "String"
  value = var.dns_address

  tags = {
    Env = var.env
  }
}