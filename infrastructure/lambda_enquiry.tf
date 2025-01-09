# Enquiry Service Lambda
module "enquiry_lambda" {
  source          = "git::https://github.com/dvsa/cvs-tf-modules//service_lambda?ref=feature/CB2-14857"
  name            = var.DVSA_SERVICE
  region          = var.AWS_REGION
  handler         = "src/handler.handler"
  description     = "${title(var.DVSA_SERVICE)} Service"
  scheduled_tasks = var.scheduled_tasks
  appconfig_id    = local.appconfig_id

  subnet_ids         = local.subnet_ids
  security_group_ids = local.security_group_ids

  lambda_triggers = {
    for service in var.lambda_services : service => { 
      "arn"       = "${module.api_gateway.api_execution_arn}/*/*/${service}"
      "principal" = "apigateway.amazonaws.com"
    }
  }

  additional_env_vars = {
    AWS_S3_BUCKET_NAME = module.document_feed.bucket_id
    SECRET             = "${var.AWS_ENVIRONMENT}/rds-lambda-auth-ro/config"
    SCHEMA_NAME        = replace(upper("CVSNOP${var.AWS_ENVIRONMENT}"), "-", "")
  }

  cloudwatch_alarms = {
    enabled = true
    timeout = {
      dimensions = {
        Environment = var.AWS_ENVIRONMENT
        Service     = format(local.name.cloudwatch, "lambda", var.DVSA_SERVICE)
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
  name              = var.DVSA_SERVICE
  environment       = var.AWS_ENVIRONMENT
  api_parent_name   = local.api_parent_name
  api_authorizer_id = local.api_authorizer_id
  region            = var.AWS_REGION
  service_version   = var.api_version
  api_doc           = "${path.root}/data/openapi_doc.yaml.tftpl"
  api_resources     = var.lambda_services

  # Create Cloudwatch Alarms either by using the default config (var.cloudwatch_alarms) or 
  #   create a custom definition to replace required values
  cloudwatch_alarms = {
    "4XX" = var.cloudwatch_alarms
    "5XX" = var.cloudwatch_alarms
  }
}

module "enquiry_config" {
  for_each = var.create_appconfig_profile ? toset([var.DVSA_SERVICE]) : []
  source = "git::https://github.com/dvsa/cvs-tf-modules//app_config?ref=feature/CB2-14860"
  appconfig_id = data.terraform_remote_state.core.outputs.appconfig_application_id
  name         = each.key
  description  = "Enquiry Service"
}

output "configuration_profile_id" {
  value = try(module.enquiry_config.configuration_profile_id, null)
}