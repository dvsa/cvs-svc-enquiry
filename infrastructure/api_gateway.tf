module "api_gateway" {
  source           = "./modules/api-gateway"
  parent_api       = terraform.workspace
  service_version  = "v1"
  api_doc          = "data/openapi_doc.yaml.tftpl"
  api_service_name = var.service
  api_resources    = var.api_resources
  lambda_uri       = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:${var.AWS_ACCOUNT_ID}:function:${module.enquiry_lambda.function_name}/invocations"
}

output "api_gateway_id" {
  value = module.api_gateway.api_gateway_id
}

output "api_gateway_arn" {
  value = module.api_gateway.api_gateway_arn
}

output "api_stage" {
  value = module.api_gateway.api_stage
}

output "api_deployment" {
  value = module.api_gateway.api_deployment
}

output "api_resources" {
  value = keys(yamldecode(module.api_gateway.api_config.body).paths)
}

output "api_execution_arn" {
  value = module.api_gateway.api_execution_arn
}