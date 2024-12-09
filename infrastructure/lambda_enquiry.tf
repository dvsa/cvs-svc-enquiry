# Enquiry Service Lambda
module "enquiry_lambda" {
  source          = "./modules/lambda-iam"
  name            = var.DVSA_SERVICE
  handler         = "src/handler.handler"
  description     = "${title(var.DVSA_SERVICE)} Service"
  scheduled_tasks = var.scheduled_tasks
  lambda_triggers = {
    for service in local.services : service => { 
      "arn"       = "${module.api_gateway.api_execution_arn}/*/*/${service}"
      "principal" = "apigateway.amazonaws.com"
    }
  }

  additional_env_vars = {
    AWS_S3_BUCKET_NAME = module.document_feed.bucket_name
    SECRET             = "${var.AWS_ENVIRONMENT}/rds-lambda-auth-ro/config"
    SCHEMA_NAME        = replace(upper("CVSNOP${var.AWS_ENVIRONMENT}"), "-", "")
  }

  cloudwatch_alarms = {
    enabled = true
    timeout = {
      dimensions = {
        Environment = var.AWS_ENVIRONMENT
        Service     = format(local.name.cloudwatch, var.DVSA_SERVICE)
      }
    }
    errors = {
      dimensions = {
        FunctionName = var.DVSA_SERVICE
      }
    }
  }
}

# Enquiry Service API
module "api_gateway" {
  source            = "git::https://github.com/dvsa/cvs-tf-modules//api_gateway?ref=feature/CB2-14857"  
  service_name      = var.DVSA_SERVICE
  environment       = var.AWS_ENVIRONMENT
  service_version   = var.api_version
  api_doc           = "${path.root}/data/openapi_doc.yaml.tftpl"
  api_resources     = local.services

  # Create Cloudwatch Alarms either by using the default config (var.cloudwatch_alarms) or 
  #   create a custom definition to replace required values
  cloudwatch_alarms = {
    "4XX" = var.cloudwatch_alarms
    "5XX" = var.cloudwatch_alarms
  }
}
