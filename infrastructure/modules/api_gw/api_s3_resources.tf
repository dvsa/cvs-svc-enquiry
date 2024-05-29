resource "aws_api_gateway_resource" "folder" {
  parent_id   = aws_api_gateway_rest_api.apigw.root_resource_id
  path_part   = "{folder}"
  rest_api_id = aws_api_gateway_rest_api.apigw.id
  depends_on  = [aws_api_gateway_model.EmptySchema]
}

resource "aws_api_gateway_resource" "item" {
  parent_id   = aws_api_gateway_resource.folder.id
  path_part   = "{item}"
  rest_api_id = aws_api_gateway_rest_api.apigw.id
}