output "api_gateway_id" {
  value = module.api_gateway.api_gateway_id
}

output "api_gateway_arn" {
  value = module.api_gateway.api_gateway_arn
}

output "api_stage" {
  value = module.api_gateway.api_stage
}

output "api_deployment" {
  value = module.api_gateway.api_deployment
}

output "api_resources" {
  value = keys(yamldecode(module.api_gateway.api_config.body).paths)
}

output "api_execution_arn" {
  value = module.api_gateway.api_execution_arn
}

