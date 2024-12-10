data "aws_api_gateway_rest_api" "remote_gateway" {
  name = data.terraform_remote_state.core.outputs.api_gateway_name
}


data "aws_caller_identity" "current" {}
data "aws_region" "current" {}
data "aws_availability_zones" "current" {}

data "aws_s3_objects" "service_hashes" {
  bucket = var.s3_bucket
  prefix = "${local.bucket_prefix}/latestHash_${local.environment}"
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
  application_id = data.terraform_remote_state.core.outputs.aws_appconfig_application_id
}


data "aws_appconfig_environment" "environment" {
  for_each       = data.aws_appconfig_environments.environments.environment_ids
  application_id = data.terraform_remote_state.core.outputs.aws_appconfig_application_id
  environment_id = each.value
}

## Firehost Data
data "aws_kinesis_firehose_delivery_stream" "firehose_metrics" {
  for_each = var.enable_firehose ? { (local.environment) = local.environment } : {}
  name     = "metrics=${each.key}"
}

data "aws_iam_role" "firehose_metrics" {
  for_each = var.enable_firehose ? { (local.environment) = local.environment } : {}
  name     = "cvs-service-logs-firehose-delivery-${each.key}"
}