output "arn" {
  value = aws_lambda_function.service.arn
}

output "invoke_arn" {
  value = aws_lambda_function.service.invoke_arn
}

output "function_name" {
  value = aws_lambda_function.service.function_name
}

output "log_group_name" {
  value = aws_cloudwatch_log_group.logs.name
}

output "role_name" {
  value       = aws_iam_role.main.name
  description = "The name of the role"
}
