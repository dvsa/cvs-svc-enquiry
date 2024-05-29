resource "aws_lambda_alias" "main" {
  name             = var.environment
  description      = "Alias for ${aws_lambda_function.service.function_name}"
  function_name    = aws_lambda_function.service.arn
  function_version = "$LATEST"
}
