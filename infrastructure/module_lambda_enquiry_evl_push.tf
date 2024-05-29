locals {

  enquiry_sftp_push = {
    name        = "enquiry-sftp-file-push"
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

module "enquiry_sftp_file_push" {
  source         = "./modules/lambda-iam"
  s3_prefix      = "enquiry-evl-file-push"
  aws_account_id = data.aws_caller_identity.current.account_id
  service_map    = local.enquiry_sftp_push
  service_name   = local.enquiry_sftp_push.name

  custom_policy_enabled = false
  principal_services    = ["s3"]
  invoker_source_arns   = [aws_s3_bucket.enquiry_document_feed.arn]

  project     = var.project
  environment = terraform.workspace
  component   = var.component
  module      = "lambda"
  region      = var.region
  runtime     = "nodejs18.x"

  subnet_ids = local.subnet_ids
  lambda_sgs = local.lambda_sgs

  dlq_arn = aws_sqs_queue.enquiry_evl_push_lambda.arn

  additional_env_vars = var.sftp_vars

  read_from_app_config      = true
  app_config_id             = var.app_config_ids.app_config_id
  app_config_environment_id = var.app_config_environment_id
}

