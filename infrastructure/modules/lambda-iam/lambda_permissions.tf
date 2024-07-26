resource "aws_lambda_permission" "allow_invoke" {
  for_each = merge(var.lambda_triggers, {
    for task in var.scheduled_tasks : task => { 
      "arn" = aws_cloudwatch_event_rule.lambda_trigger[task].arn
      "principal" = "events.amazonaws.com"
    } if var.schedule_hour != null
  })
  statement_id  = "AllowInvokeLambdaFunction${title(each.key)}"
  function_name = aws_lambda_function.service.function_name
  action        = "lambda:InvokeFunction"
  principal     = each.value["principal"]
  source_arn    = each.value["arn"]
}