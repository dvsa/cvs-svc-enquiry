resource "aws_api_gateway_method" "log_any" {
  count            = local.verb_count
  authorization    = "NONE"
  http_method      = var.verb
  resource_id      = var.resource_id
  rest_api_id      = var.api_id
  api_key_required = true
}

resource "aws_api_gateway_integration" "log_any" {
  count                   = local.verb_count
  rest_api_id             = var.api_id
  resource_id             = var.resource_id
  http_method             = aws_api_gateway_method.log_any[0].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  timeout_milliseconds    = 29000
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:${var.account_id}:function:${var.lambda_name}/invocations"
}
