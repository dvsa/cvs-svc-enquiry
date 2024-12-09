resource "aws_api_gateway_method" "activities" {
  count         = local.option_count
  authorization = "NONE"
  http_method   = "OPTIONS"
  resource_id   = var.resource_id
  rest_api_id   = var.api_id
}

resource "aws_api_gateway_method_response" "activities_response_200" {
  count       = local.option_count
  rest_api_id = var.api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.activities[0].http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Methods" : true,
    "method.response.header.Access-Control-Allow-Headers" : true,
    "method.response.header.Access-Control-Allow-Origin" : true
  }
  response_models = {
    "application/json" = "EmptySchema"
  }
}

resource "aws_api_gateway_integration" "activities" {
  count                = local.option_count
  rest_api_id          = var.api_id
  resource_id          = var.resource_id
  http_method          = aws_api_gateway_method.activities[0].http_method
  type                 = "MOCK"
  timeout_milliseconds = 29000
  passthrough_behavior = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = <<EOF
{ "statusCode": 200 }
EOF
  }
}

resource "aws_api_gateway_integration_response" "activities" {
  count       = local.option_count
  rest_api_id = var.api_id
  resource_id = var.resource_id
  http_method = aws_api_gateway_method.activities[0].http_method
  status_code = aws_api_gateway_method_response.activities_response_200[0].status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Methods" : "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
    "method.response.header.Access-Control-Allow-Headers" : "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Origin" : "'*'"
  }
  depends_on = [
    aws_api_gateway_integration.activities
  ]
}

resource "aws_api_gateway_method" "activities_any" {
  count              = local.verb_count
  authorization      = "CUSTOM"
  http_method        = var.verb
  resource_id        = var.resource_id
  rest_api_id        = var.api_id
  authorizer_id      = var.authoriser_id
  request_parameters = var.request_parameters
}

resource "aws_api_gateway_integration" "activities_any" {
  count                   = local.verb_count
  rest_api_id             = var.api_id
  resource_id             = var.resource_id
  http_method             = aws_api_gateway_method.activities_any[0].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  timeout_milliseconds    = 29000
  passthrough_behavior    = "WHEN_NO_MATCH"
  uri                     = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:${var.account_id}:function:${var.lambda_name}/invocations"
}
