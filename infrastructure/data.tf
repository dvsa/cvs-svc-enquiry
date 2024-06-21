data "aws_api_gateway_rest_api" "remote_gateway" {
  name = terraform.workspace
}


data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_availability_zones" "current" {}
data "aws_acm_certificate" "cvs_cert" {
  provider = aws.us-east-1
  domain   = "*.${local.domain}"
}
data "aws_acm_certificate" "regional_cert" {
  for_each = { (terraform.workspace) = "deploy" }
  domain   = "*.${local.domain}"
}
data "aws_route53_zone" "r53" {
  name = local.domain
}

data "aws_iam_policy_document" "fh_cw_assume" {
  for_each = local.enable_firehose
  statement {
    sid     = "AllowCWToAssumeRole"
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      identifiers = ["logs.amazonaws.com"]
      type        = "Service"
    }
  }
}

data "terraform_remote_state" "current_or_dev" {
  backend   = "s3"
  workspace = terraform.workspace
  config = {
    bucket         = "cvs-tf-environment"
    key            = "tf_state"
    region         = "eu-west-1"
    dynamodb_table = "cvs-tf-environment"
    profile        = "mgmt"
  }
}

## Firehost Data
data "aws_kinesis_firehose_delivery_stream" "firehose_metrics" {
  for_each = local.enable_firehose
  name     = "metrics=${each.key}"
}

data "aws_iam_role" "firehose_metrics" {
  for_each = local.enable_firehose
  name     = "cvs-service-logs-firehose-delivery-${each.key}"
}

## Secrets Data
data "aws_secretsmanager_secret" "api-key" {
  name = "${var.GITHUB_ENVIRONMENT}/${var.api_service_name}/api-key"
}

data "aws_secretsmanager_secret_version" "api-key" {
  secret_id = data.aws_secretsmanager_secret.api-key.id
}


data "aws_appconfig_environments" "app_config_environments" {
  application_id = var.app_config_ids["app_config_id"]
}


data "aws_api_gateway_authorizer" "lambda_auth" {
  rest_api_id      = data.aws_api_gateway_rest_api.remote_gateway.id
  authorizer_id    = data.terraform_remote_state.current_or_dev.outputs.lambda_authorizer_id
}
# output "app_env" {
#   value = data.aws_appconfig_environments.app_config_environments
# }

## S3 Access Logging
data "aws_kms_key" "access_logging_s3" {
  key_id = "alias/s3-access-logging-${terraform.workspace}"
}

data "aws_s3_bucket" "access_logging" {
  #checkov:skip=CKV_AWS_144:This bucket does not require cross region replication.
  bucket = "cvs-s3-access-logs-${terraform.workspace}"
}