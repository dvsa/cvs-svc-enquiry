output "apigw_ids" {
  value = aws_api_gateway_rest_api.apigw.id
}

output "root_res_ids" {
  value = aws_api_gateway_rest_api.apigw.root_resource_id
}

output "domain_names" {
  value = aws_api_gateway_domain_name.domain_name.domain_name
}

output "redeployment_spec" {
  value = local.redeployment_spec
}

output "reference_data_role" {
  value = aws_iam_role.reference_data.name
}

output "execution_arn" {
  value = aws_api_gateway_rest_api.apigw.execution_arn
}

output "lambda_authorizer_id" {
  value = aws_api_gateway_authorizer.lambda_auth.id
}