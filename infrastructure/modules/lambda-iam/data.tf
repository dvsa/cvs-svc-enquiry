data "aws_api_gateway_rest_api" "remote_gateway" {
  name = var.AWS_ENVIRONMENT
}


data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_availability_zones" "current" {}

data "aws_s3_objects" "service_hashes" {
  bucket = var.s3_bucket
  prefix = "${local.bucket_prefix}/latestHash_${var.AWS_ENVIRONMENT}"
}

data "aws_s3_object" "service_hash" {
  bucket = var.s3_bucket
  key = try(data.aws_s3_objects.service_hashes.keys[0], "${local.bucket_prefix}/latestHash_develop.txt")
}

data "aws_s3_object" "service" {
  bucket = var.s3_bucket
  key    = "${local.bucket_prefix}/${data.aws_s3_object.service_hash.body}.zip"
}

data "aws_appconfig_environments" "environments" {
  application_id = "j7jocye"
}


data "aws_appconfig_environment" "environment" {
  for_each       = data.aws_appconfig_environments.environments.environment_ids
  application_id = var.app_config_id
  environment_id = each.value
}

data "terraform_remote_state" "current_or_dev" {
  backend   = "s3"
  workspace = var.AWS_ENVIRONMENT
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
  for_each = var.enable_firehose ? { (var.AWS_ENVIRONMENT) = var.AWS_ENVIRONMENT } : {}
  name     = "metrics=${each.key}"
}

data "aws_iam_role" "firehose_metrics" {
  for_each = var.enable_firehose ? { (var.AWS_ENVIRONMENT) = var.AWS_ENVIRONMENT } : {}
  name     = "cvs-service-logs-firehose-delivery-${each.key}"
}