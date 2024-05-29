resource "aws_lambda_permission" "allow_invoke" {
  count         = length(var.principal_services)
  statement_id  = "Allow${var.principal_services[count.index]}InvokeLambdaFunction${count.index > 0 ? count.index : ""}"
  function_name = aws_lambda_function.service.function_name
  action        = "lambda:InvokeFunction"
  principal     = "${var.principal_services[count.index]}.amazonaws.com"
  source_arn    = var.invoker_source_arns[count.index]
}