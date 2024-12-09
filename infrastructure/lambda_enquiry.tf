module "enquiry_lambda" {
  source          = "./modules/lambda-iam"
  name            = var.service
  handler         = "src/handler.handler"
  description     = "${title(var.service)} Service"
  environment     = terraform.workspace
  scheduled_tasks = var.scheduled_tasks
  schedule_hour   = var.schedule_hour
  lambda_triggers = {
    for service in var.api_resources : service => { 
      "arn" = "${module.api_gateway.api_execution_arn}/*/*/${service}"
      "principal" = "apigateway.amazonaws.com"
    }
  }

  additional_env_vars = {
    AWS_S3_BUCKET_NAME = "${var.project}-${var.service}-document-feed-${terraform.workspace}"
    SECRET             = "${var.AWS_ACCOUNT}/rds-lambda-auth-ro/config"
    SCHEMA_NAME        = replace(upper("CVSNOP${terraform.workspace}"), "-", "")
  }

  cloudwatch_alarms = {
    enabled = true
    timeout = {
      dimensions = {
        Environment = terraform.workspace
        Service     = "/aws/lambda/${var.service}"
      }
    }
    errors = {
      dimensions = {
        FunctionName = var.service
      }
    }
  }
}