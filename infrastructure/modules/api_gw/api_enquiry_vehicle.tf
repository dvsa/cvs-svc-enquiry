resource "aws_api_gateway_resource" "enquiry_vehicle" {
  parent_id   = aws_api_gateway_resource.enquiry.id
  path_part   = "vehicle"
  rest_api_id = aws_api_gateway_rest_api.this_gateway.id
}

resource "aws_api_gateway_method" "enquiry_vehicle" {
  authorization    = "CUSTOM"
  http_method      = "ANY"
  resource_id      = aws_api_gateway_resource.enquiry_vehicle.id
  rest_api_id      = aws_api_gateway_rest_api.this_gateway.id
  authorizer_id    = aws_api_gateway_authorizer.lambda_auth.id
  api_key_required = true
}

# module "enquiry_vehicle_options" {
#   source        = "./standardendpoint"
#   account_id    = var.account_id
#   authoriser_id = aws_api_gateway_authorizer.lambda_auth.id
#   resource_id   = aws_api_gateway_resource.enquiry_vehicle.id
#   api_id        = aws_api_gateway_rest_api.this_gateway.id
#   include_verb  = false
# }

resource "aws_api_gateway_method_response" "enquiry_vehicle_200" {
  rest_api_id = aws_api_gateway_rest_api.this_gateway.id
  resource_id = aws_api_gateway_resource.enquiry_vehicle.id
  http_method = aws_api_gateway_method.enquiry_vehicle.http_method
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

resource "aws_api_gateway_integration" "enquiry_vehicle" {
  rest_api_id             = aws_api_gateway_rest_api.this_gateway.id
  resource_id             = aws_api_gateway_resource.enquiry_vehicle.id
  http_method             = aws_api_gateway_method.enquiry_vehicle.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  timeout_milliseconds    = 29000
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"
  uri                     = "arn:aws:apigateway:eu-west-1:lambda:path/2015-03-31/functions/arn:aws:lambda:eu-west-1:${var.AWS_ACCOUNT}:function:${var.lambdas.enquiry}/invocations"
}

resource "aws_api_gateway_integration_response" "enquiry_vehicle" {
  rest_api_id = aws_api_gateway_rest_api.this_gateway.id
  resource_id = aws_api_gateway_resource.enquiry_vehicle.id
  http_method = aws_api_gateway_method.enquiry_vehicle.http_method
  status_code = aws_api_gateway_method_response.enquiry_vehicle_200.status_code
  depends_on = [
    aws_api_gateway_integration.enquiry_vehicle
  ]
}
