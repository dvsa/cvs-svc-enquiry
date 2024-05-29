resource "aws_api_gateway_rest_api" "this_gateway" {
  name = "enquiries-${terraform.workspace}"
  binary_media_types = ["application/octet-stream"]
  tags = local.tags
}

resource "aws_api_gateway_gateway_response" "default_4xx" {
  rest_api_id   = aws_api_gateway_rest_api.this_gateway.id
  response_type = "DEFAULT_4XX"

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Methods" : "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
    "gatewayresponse.header.Access-Control-Allow-Origin" : "'*'",
    "gatewayresponse.header.Access-Control-Allow-Headers" : "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }
}

resource "aws_api_gateway_gateway_response" "default_5xx" {
  rest_api_id   = aws_api_gateway_rest_api.this_gateway.id
  response_type = "DEFAULT_5XX"

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Methods" : "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
    "gatewayresponse.header.Access-Control-Allow-Origin" : "'*'",
    "gatewayresponse.header.Access-Control-Allow-Headers" : "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }
}


resource "aws_api_gateway_resource" "enquiry" {
  parent_id   = aws_api_gateway_rest_api.this_gateway.root_resource_id
  path_part   = "enquiry"
  rest_api_id = aws_api_gateway_rest_api.this_gateway.id
  depends_on  = [aws_api_gateway_model.EmptySchema]
}

resource "aws_api_gateway_model" "EmptySchema" {
  rest_api_id  = aws_api_gateway_rest_api.this_gateway.id
  name         = "EmptySchema"
  description  = "Empty Schema"
  content_type = "application/json"

  schema = <<EOF
{
    "title": "Empty Schema",
    "type": "object"
}
EOF
}

