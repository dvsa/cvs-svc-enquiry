output "api_gateway_id" {
  value = aws_api_gateway_rest_api.service.id
}

output "api_gateway_arn" {
  value = aws_api_gateway_rest_api.service.arn
}

output "api_execution_arn" {
  value = aws_api_gateway_rest_api.service.execution_arn
}

output "api_stage" {
  value = terraform_data.create_stage.output.stage
}

output "api_deployment" {
  value = terraform_data.create_stage.output.deployment
}

output "api_resources" {
  value = aws_api_gateway_resource.service
}