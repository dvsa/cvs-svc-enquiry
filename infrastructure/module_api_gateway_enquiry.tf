module "api_gateway" {
  source = "./modules/api-gateway"
  parent_api       = data.aws_api_gateway_rest_api.remote_gateway.id
  service_version  = "v1"
  default_tags     = local.tags
  enable_cw_alarms = false
  api_doc          = "data_openapi_doc.yaml.tftpl"
  api_service_name = "enquiry"
  api_resources    = local.api_resources
  authorizer_id    = data.aws_api_gateway_authorizer.lambda_auth.id
  lambda_uri       = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:${var.AWS_ACCOUNT}:function:${module.enquiry_lambda.function_name}/invocations"
}