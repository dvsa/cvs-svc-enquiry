locals {

  enquiry_sftp_push = {
    name        = "${var.api_service_name}-sftp-file-push"
    version     = terraform.workspace
    handler     = "handler/s3Event.handler",
    description = "Push S3 data feed to SFTP ${terraform.workspace}",
    component   = "enq",
    memory      = 5000,
    timeout     = 30
  }
  sftp_endpoint     = var.create_develop_sftp_server ? data.terraform_remote_state.current_or_dev.outputs["sftp_endpoint"] : ""
  evl_config_prefix = var.environment
}

module "sftp_file_push" {
  source         = "./modules/lambda-iam"
  s3_prefix      = "${var.api_service_name}-evl-file-push"
  aws_account_id = data.aws_caller_identity.current.account_id
  service_map    = local.enquiry_sftp_push
  service_name   = local.enquiry_sftp_push.name

  custom_policy_enabled = false
  lambda_triggers  = {
    bucket = {
      arn = aws_s3_bucket.document_feed.arn
      principal = "s3.amazonaws.com"
    }
  }

  project     = var.project
  environment = terraform.workspace
  component   = var.component
  module      = "lambda"
  region      = var.region
  runtime     = "nodejs18.x"

  subnet_ids = local.subnet_ids
  lambda_sgs = local.lambda_sgs

  dlq_arn = aws_sqs_queue.evl_push_lambda.arn

  additional_env_vars = var.sftp_vars

  read_from_app_config      = true
  app_config_id             = var.app_config_ids.app_config_id
  app_config_environment_id = var.app_config_environment_id
}

