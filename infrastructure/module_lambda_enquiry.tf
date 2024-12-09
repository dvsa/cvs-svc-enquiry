locals {
  enquiry_ver = terraform.workspace
  enquiry_service_map = {
    name        = "enquiry"
    version     = local.enquiry_ver
    handler     = "src/handler.handler",
    description = "Enquiry",
    component   = "enq",
    memory      = 1024,
    timeout     = 60,
  }
  enquiry_api_key = replace(data.aws_secretsmanager_secret_version.enquiry-api-key.secret_string, "BRANCH", terraform.workspace)
}


module "enquiry_lambda" {
  source         = "./modules/lambda-iam"
  aws_account_id = data.aws_caller_identity.current.account_id
  service_map    = local.enquiry_service_map
  service_name   = local.enquiry_service_map.name

  principal_services  = ["apigateway", "events"]
  invoker_source_arns = [data.aws_api_gateway_rest_api.remote_gateway.arn, aws_cloudwatch_event_rule.trigger_enquiry_lambda_tfl.arn, aws_cloudwatch_event_rule.trigger_enquiry_lambda_evl.arn]

  custom_policy_enabled = false
  project               = var.project
  environment           = terraform.workspace
  component             = var.component
  region                = var.region
  module                = "lambda"
  runtime               = "nodejs18.x"

  subnet_ids = data.terraform_remote_state.current_or_dev.outputs["private_subnets"] 
  lambda_sgs = [data.terraform_remote_state.current_or_dev.outputs["lambda_sg"]]

  additional_env_vars = {
    AWS_S3_BUCKET_NAME = "cvs-enquiry-document-feed-${terraform.workspace}"
    SECRET             = "${var.aws_environment}/rds-lambda-auth-ro/config"
    SCHEMA_NAME        = replace(upper("CVSNOP${terraform.workspace}"), "-", "")
  }

  read_from_app_config      = true
  app_config_id             = var.app_config.app_config_id
  app_config_environment_id = var.app_config_environment_id
}

resource "aws_lambda_permission" "enquiry" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = module.enquiry_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = data.aws_api_gateway_rest_api.remote_gateway.arn
}

resource "aws_cloudwatch_log_subscription_filter" "enquiry" {
  for_each        = local.enable_firehose
  log_group_name  = module.enquiry_lambda.log_group_name
  name            = "${local.enquiry_service_map.name}-${terraform.workspace}-metrics"
  destination_arn = data.aws_kinesis_firehose_delivery_stream.firehose_metrics[each.key].arn
  role_arn        = data.aws_iam_role.firehose_metrics[each.key].arn
  filter_pattern  = ""
}

resource "aws_api_gateway_api_key" "enquiry-api" {
  name  = "enquiry-api-${terraform.workspace}"
  value = local.enquiry_api_key
  tags = {
    Environment = terraform.workspace
  }
}

# resource "aws_api_gateway_usage_plan" "enquiry-up" {
#   name = "enquiry-up-${terraform.workspace}"
#   api_stages {
#     api_id = data.aws_api_gateway_rest_api.remote_gateway.id
#     stage  = aws_api_gateway_stage.stage.stage_name
#   }
# }

# resource "aws_api_gateway_usage_plan_key" "enquiry-upk" {
#   key_id        = aws_api_gateway_api_key.enquiry-api.id
#   key_type      = "API_KEY"
#   usage_plan_id = aws_api_gateway_usage_plan.enquiry-up.id
# }

