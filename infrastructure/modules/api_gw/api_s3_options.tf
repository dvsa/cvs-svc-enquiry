resource "aws_api_gateway_method" "s3_options" {
  authorization = "NONE"
  http_method   = "OPTIONS"
  resource_id   = aws_api_gateway_resource.item.id
  rest_api_id   = aws_api_gateway_rest_api.apigw.id
}

resource "aws_api_gateway_method_response" "s3_options_response_200" {
  rest_api_id = aws_api_gateway_rest_api.apigw.id
  resource_id = aws_api_gateway_resource.item.id
  http_method = aws_api_gateway_method.s3_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Methods" : false,
    "method.response.header.Access-Control-Allow-Headers" : false,
    "method.response.header.Access-Control-Allow-Origin" : false
  }
  response_models = {
    "application/json" = "Empty"
  }
  depends_on = [aws_api_gateway_model.EmptySchema]
}

resource "aws_api_gateway_integration" "s3_options" {
  rest_api_id          = aws_api_gateway_rest_api.apigw.id
  resource_id          = aws_api_gateway_resource.item.id
  http_method          = aws_api_gateway_method.s3_options.http_method
  type                 = "MOCK"
  timeout_milliseconds = 29000
  passthrough_behavior = "WHEN_NO_MATCH"

  request_templates = {
    "application/json" = <<EOF
{ "statusCode": 200 }
EOF
  }
}

resource "aws_api_gateway_integration_response" "s3_options" {
  rest_api_id = aws_api_gateway_rest_api.apigw.id
  resource_id = aws_api_gateway_resource.item.id
  http_method = aws_api_gateway_method.s3_options.http_method
  status_code = aws_api_gateway_method_response.s3_options_response_200.status_code
  response_parameters = {
    "method.response.header.Access-Control-Allow-Methods" : "'GET,OPTIONS,PUT'",
    "method.response.header.Access-Control-Allow-Headers" : "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Origin" : "'*'"
  }
  depends_on = [
    aws_api_gateway_integration.s3_options
  ]
}
