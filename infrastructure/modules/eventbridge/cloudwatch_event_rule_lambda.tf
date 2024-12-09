resource "aws_cloudwatch_event_rule" "lambda" {
  count               = var.rule_schedule_expression == "" ? 0 : 1
  name                = local.csi
  description         = "${local.csi}-${var.service_name}"
  schedule_expression = var.rule_schedule_expression
  state               = var.is_enabled
}
