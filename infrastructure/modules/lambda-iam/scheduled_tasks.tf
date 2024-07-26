resource "aws_cloudwatch_event_rule" "lambda_trigger" {
  for_each            = var.schedule_hour != null ? var.scheduled_tasks : []
  name                = "${terraform.workspace}-trigger-${each.value}-feed-every-day"
  description         = "${var.schedule_day[each.value]} at ${format("%02s%02s", tostring(var.schedule_hour), tostring(var.schedule_min))}hrs"
  schedule_expression = "cron(${var.schedule_min} ${var.schedule_hour} ? * ${var.schedule_day[each.value]} *)"
}

resource "aws_cloudwatch_event_target" "lambda_trigger" {
  for_each = var.schedule_hour != null ? var.scheduled_tasks : []
  rule     = aws_cloudwatch_event_rule.lambda_trigger[each.value].name
  arn      = aws_lambda_function.service.arn
  input    = templatefile("${path.root}/data/lambda_trigger.json.tftpl", { client = each.value })
}

