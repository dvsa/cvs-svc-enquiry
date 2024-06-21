resource "aws_lambda_permission" "allow_invoke" {
  for_each      = var.lambda_triggers
  statement_id  = "AllowInvokeLambdaFunction${each.key}"
  function_name = aws_lambda_function.service.function_name
  action        = "lambda:InvokeFunction"
  principal     = each.value["principal"]
  source_arn    = each.value["arn"]
}