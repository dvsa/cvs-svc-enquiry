resource "aws_api_gateway_resource" "v1" {
  parent_id   = aws_api_gateway_rest_api.apigw.root_resource_id
  path_part   = "v1"
  rest_api_id = aws_api_gateway_rest_api.apigw.id
  depends_on  = [aws_api_gateway_model.EmptySchema]
}

resource "aws_api_gateway_resource" "enquiry" {
  parent_id   = aws_api_gateway_resource.v1.id
  path_part   = "enquiry"
  rest_api_id = aws_api_gateway_rest_api.apigw.id
}
