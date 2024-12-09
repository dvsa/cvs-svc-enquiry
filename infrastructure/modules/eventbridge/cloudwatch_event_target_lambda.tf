resource "aws_cloudwatch_event_target" "lambda" {
  count     = var.rule_schedule_expression == "" ? 0 : 1
  arn       = var.event_target_lambda
  rule      = aws_cloudwatch_event_rule.lambda[count.index].name
  target_id = local.csi
}
