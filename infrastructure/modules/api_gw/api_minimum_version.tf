resource "aws_api_gateway_resource" "minimum_version" {
  parent_id   = aws_api_gateway_rest_api.apigw.root_resource_id
  path_part   = "minimum-version"
  rest_api_id = aws_api_gateway_rest_api.apigw.id
  depends_on  = [aws_api_gateway_model.EmptySchema]
}

module "minimum_version" {
  source        = "./standardendpoint"
  account_id    = var.account_id
  authoriser_id = aws_api_gateway_authorizer.lambda_auth.id
  resource_id   = aws_api_gateway_resource.minimum_version.id
  api_id        = aws_api_gateway_rest_api.apigw.id
  lambda_name   = var.lambdas.minimum_application_version
}