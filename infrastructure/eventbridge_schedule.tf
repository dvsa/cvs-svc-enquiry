resource "aws_cloudwatch_event_rule" "lambda_trigger" {
  for_each            = local.scheduled_tasks
  name                = "${terraform.workspace}-trigger-${each.value}-feed-every-day"
  description         = "${var.schedule_day[each.value]} at ${var.schedule_hour[var.aws_environment]}00hrs"
  schedule_expression = "cron(0 ${var.schedule_hour[var.aws_environment]} ? * ${var.schedule_day[each.value]} *)"
}

resource "aws_cloudwatch_event_target" "lambda_trigger" {
  for_each = local.scheduled_tasks
  rule     = aws_cloudwatch_event_rule.lambda_trigger[each.value].name
  arn      = module.enquiry_lambda.arn
  input    = templatefile("./data/enquiry_lambda_trigger.json.tftpl", { client = each.value })
}

