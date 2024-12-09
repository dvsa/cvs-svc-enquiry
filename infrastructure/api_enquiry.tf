resource "aws_api_gateway_resource" "resource" {
  for_each    = local.api_resources
  parent_id   = aws_api_gateway_resource.enquiry.id
  path_part   = each.key
  rest_api_id = aws_api_gateway_rest_api.this_gateway.id
}

resource "aws_api_gateway_method" "resource" {
  for_each         = local.api_resources
  authorization    = "NONE"
  http_method      = "ANY"
  resource_id      = aws_api_gateway_resource.resource[each.key].id
  rest_api_id      = aws_api_gateway_rest_api.this_gateway.id
  # authorizer_id    = aws_api_gateway_authorizer.lambda_auth.id
  # api_key_required = true
}


resource "aws_api_gateway_method_response" "response_200" {
  for_each    = local.api_resources
  rest_api_id = aws_api_gateway_rest_api.this_gateway.id
  resource_id = aws_api_gateway_resource.resource[each.key].id
  http_method = aws_api_gateway_method.resource[each.key].http_method
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

resource "aws_api_gateway_integration" "resource" {
  for_each                = local.api_resources
  rest_api_id             = aws_api_gateway_rest_api.this_gateway.id
  resource_id             = aws_api_gateway_resource.resource[each.key].id
  http_method             = aws_api_gateway_method.resource[each.key].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  timeout_milliseconds    = 29000
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"
  uri                     = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:${var.AWS_ACCOUNT}:function:${module.enquiry_lambda.function_name}/invocations"
}

resource "aws_api_gateway_integration_response" "resource" {
  for_each    = local.api_resources
  rest_api_id = aws_api_gateway_rest_api.this_gateway.id
  resource_id = aws_api_gateway_resource.resource[each.key].id
  http_method = aws_api_gateway_method.resource[each.key].http_method
  status_code = aws_api_gateway_method_response.response_200[each.key].status_code
  depends_on = [
    aws_api_gateway_integration.resource
  ]
}
