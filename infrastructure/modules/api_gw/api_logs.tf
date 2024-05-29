# TODO - Remove these log parts in the future and use the new log endpoint for a simpler logging method.
resource "aws_api_gateway_resource" "logs" {
  parent_id   = aws_api_gateway_rest_api.apigw.root_resource_id
  path_part   = "logs"
  rest_api_id = aws_api_gateway_rest_api.apigw.id
  depends_on  = [aws_api_gateway_model.EmptySchema]
}

module "logs" {
  source        = "./standardendpoint"
  account_id    = var.account_id
  authoriser_id = aws_api_gateway_authorizer.lambda_auth.id
  resource_id   = aws_api_gateway_resource.logs.id
  api_id        = aws_api_gateway_rest_api.apigw.id
  lambda_name   = var.lambdas.logs
}

resource "aws_api_gateway_resource" "unauth_logs" {
  parent_id   = aws_api_gateway_rest_api.apigw.root_resource_id
  path_part   = "unauth-logs"
  rest_api_id = aws_api_gateway_rest_api.apigw.id
  depends_on  = [aws_api_gateway_model.EmptySchema]
}

module "unauth_logs" {
  source        = "./standardendpoint"
  account_id    = var.account_id
  authoriser_id = aws_api_gateway_authorizer.lambda_auth.id
  resource_id   = aws_api_gateway_resource.unauth_logs.id
  api_id        = aws_api_gateway_rest_api.apigw.id
  lambda_name   = var.lambdas.logs
}
