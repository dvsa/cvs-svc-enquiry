

resource "aws_api_gateway_resource" "root" {
  rest_api_id = data.aws_api_gateway_rest_api.parent.id
  parent_id   = data.aws_api_gateway_resource.version.id
  path_part   = var.api_service_name
}

# Service Resources on the parent Gateway (e.g. `/v1/enquiry/vehicle`)
resource "aws_api_gateway_resource" "parent" {
  for_each    = toset(var.api_resources)
  rest_api_id = data.aws_api_gateway_rest_api.parent.id
  parent_id   = aws_api_gateway_resource.root.id
  path_part   = each.value
}

resource "aws_api_gateway_method" "parent" {
  for_each         = toset(var.api_resources)
  authorization    = "CUSTOM"
  http_method      = "ANY"
  resource_id      = aws_api_gateway_resource.parent[each.key].id
  rest_api_id      = data.aws_api_gateway_rest_api.parent.id
  authorizer_id    = data.aws_api_gateway_authorizer.lambda_auth.id
  api_key_required = true
}

resource "aws_api_gateway_integration" "parent" {
  for_each                = toset(var.api_resources)
  rest_api_id             = data.aws_api_gateway_rest_api.parent.id
  resource_id             = aws_api_gateway_resource.parent[each.key].id
  http_method             = "ANY"
  integration_http_method = "GET"
  type                    = "HTTP_PROXY"
  timeout_milliseconds    = 29000
  content_handling        = "CONVERT_TO_TEXT"
  uri                     = "https://${aws_api_gateway_rest_api.service.id}.execute-api.eu-west-1.amazonaws.com/${var.service_version != null ? format("%s/", var.service_version) : null}${each.key}"
}

# Parent API Gateaay Deployment
resource "aws_api_gateway_deployment" "parent" {
  rest_api_id = data.aws_api_gateway_rest_api.parent.id
  triggers = {
    spec      = sha1(jsonencode([aws_api_gateway_method.parent[*]]))
    workspace = terraform.workspace
  }
  lifecycle {
    create_before_destroy = true
  }
}

# Create or Update API Gateway Stage
resource "terraform_data" "create_stage" {
  input = {
    deployment = aws_api_gateway_deployment.parent.id
    stage      = terraform.workspace
  }

  provisioner "local-exec" {
    environment = {
      STAGE = terraform.workspace
      API   = data.aws_api_gateway_rest_api.parent.id
      DEPLOYMENT = aws_api_gateway_deployment.parent.id
    }
    command = "bash ${path.module}/scripts/create_gateway_stage.sh"
  }
}