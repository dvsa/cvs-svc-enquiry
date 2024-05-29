resource "aws_api_gateway_method" "s3_put" {
  authorization = "CUSTOM"
  http_method   = "PUT"
  resource_id   = aws_api_gateway_resource.item.id
  rest_api_id   = aws_api_gateway_rest_api.apigw.id
  authorizer_id = aws_api_gateway_authorizer.lambda_auth.id
  request_parameters = {
    "method.request.header.Content-Type" = true
    "method.request.path.item"           = true
    "method.request.path.folder"         = true
  }
}

resource "aws_api_gateway_integration" "s3_put" {
  rest_api_id             = aws_api_gateway_rest_api.apigw.id
  resource_id             = aws_api_gateway_resource.item.id
  http_method             = aws_api_gateway_method.s3_put.http_method
  integration_http_method = "PUT"
  type                    = "AWS"
  timeout_milliseconds    = 29000
  passthrough_behavior    = "WHEN_NO_MATCH"
  credentials             = aws_iam_role.apigw_s3_cvs_signature_access_role.arn
  uri                     = "arn:aws:apigateway:eu-west-1:s3:path/{bucket}/{object}"
  request_parameters = {
    "integration.request.path.object"         = "method.request.path.item",
    "integration.request.path.bucket"         = "method.request.path.folder",
    "integration.request.header.Content-Type" = "method.request.header.Content-Type"
  }
}

resource "aws_api_gateway_integration_response" "s3_put_201" {
  rest_api_id = aws_api_gateway_rest_api.apigw.id
  resource_id = aws_api_gateway_resource.item.id
  http_method = aws_api_gateway_method.s3_put.http_method
  status_code = "201"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" : "'*'"
  }
  response_templates = {
    "application/json" = "{\"message\": \"Signature Stored\"}"
  }

  depends_on = [
    aws_api_gateway_integration.s3_put
  ]
}

resource "aws_api_gateway_method_response" "s3_put_201" {
  rest_api_id = aws_api_gateway_rest_api.apigw.id
  resource_id = aws_api_gateway_resource.item.id
  http_method = aws_api_gateway_method.s3_put.http_method
  status_code = "201"
  response_models = {
    "application/json" = "Empty"
  }
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" : true
  }
}

resource "aws_api_gateway_method_response" "s3_put_non_201" {
  for_each    = toset(["301", "307", "400", "403", "404", "405", "409", "411", "412", "416", "500", "501", "503"])
  rest_api_id = aws_api_gateway_rest_api.apigw.id
  resource_id = aws_api_gateway_resource.item.id
  http_method = aws_api_gateway_method.s3_put.http_method
  status_code = each.key
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" : true
  }
}

resource "aws_api_gateway_integration_response" "s3_put_non_201" {
  for_each          = toset(["301", "307", "400", "403", "404", "405", "409", "411", "412", "416", "500", "501", "503"])
  rest_api_id       = aws_api_gateway_rest_api.apigw.id
  resource_id       = aws_api_gateway_resource.item.id
  http_method       = aws_api_gateway_method.s3_put.http_method
  selection_pattern = each.key
  status_code       = each.key
  response_parameters = {
    "method.response.header.Access-Control-Allow-Origin" : "'*'"
  }

  depends_on = [
    aws_api_gateway_integration.s3_put
  ]
}
