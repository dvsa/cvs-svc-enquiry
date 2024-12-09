resource "aws_api_gateway_model" "EmptySchema" {
  rest_api_id  = aws_api_gateway_rest_api.apigw.id
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