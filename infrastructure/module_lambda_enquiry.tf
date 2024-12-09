locals {
  enquiry_ver = terraform.workspace
  enquiry_service_map = {
    name        = var.api_service_name
    version     = local.enquiry_ver
    handler     = "src/handler.handler",
    description = "${title(var.api_service_name)} Service",
    component   = "enq",
    memory      = 1024,
    timeout     = 60,
  }
  api_key = replace(data.aws_secretsmanager_secret_version.api-key.secret_string, "BRANCH", terraform.workspace)
}

output "state" {
  value =  data.terraform_remote_state.current_or_dev
}

module "enquiry_lambda" {
  source         = "./modules/lambda-iam"
  aws_account_id = data.aws_caller_identity.current.account_id
  service_map    = local.enquiry_service_map
  service_name   = local.enquiry_service_map.name

  lambda_triggers  = merge(
    {
      for service in local.api_resources : title(service) => { 
        "arn" = "${module.api_gateway.api_execution_arn}/*/*/${service}"
        "principal" = "apigateway.amazonaws.com"
      }
    },
    {
      for task in local.scheduled_tasks : title(task) => { 
        "arn" = aws_cloudwatch_event_rule.lambda_trigger[task].arn
        "principal" = "events.amazonaws.com"
      }
    }
  )

  custom_policy_enabled = false
  project               = var.project
  environment           = terraform.workspace
  component             = var.component
  region                = var.region
  module                = "lambda"
  runtime               = "nodejs18.x"

  subnet_ids = local.subnet_ids
  lambda_sgs = local.lambda_sgs

  additional_env_vars = {
    AWS_S3_BUCKET_NAME = "cvs-${var.api_service_name}-document-feed-${terraform.workspace}"
    SECRET             = "${var.aws_environment}/rds-lambda-auth-ro/config"
    SCHEMA_NAME        = replace(upper("CVSNOP${terraform.workspace}"), "-", "")
  }

  read_from_app_config      = true
  app_config_id             = var.app_config.app_config_id
  app_config_environment_id = var.app_config_environment_id
}

resource "aws_cloudwatch_log_subscription_filter" "filter" {
  for_each        = local.enable_firehose
  log_group_name  = module.enquiry_lambda.log_group_name
  name            = "${local.enquiry_service_map.name}-${terraform.workspace}-metrics"
  destination_arn = data.aws_kinesis_firehose_delivery_stream.firehose_metrics[each.key].arn
  role_arn        = data.aws_iam_role.firehose_metrics[each.key].arn
  filter_pattern  = ""
}

