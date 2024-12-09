resource "aws_cloudwatch_event_rule" "lambda_trigger" {
  for_each            = var.scheduled_tasks
  name                = "${terraform.workspace}-trigger-${each.key}-feed-every-day"
  description         = "${each.value.day} at ${format("%02s%02s", tostring(each.value.hour), tostring(each.value.minute))}hrs"
  schedule_expression = "cron(${each.value.minute} ${each.value.hour} ? * ${each.value.day} *)"
}

resource "aws_cloudwatch_event_target" "lambda_trigger" {
  for_each = var.scheduled_tasks 
  rule     = aws_cloudwatch_event_rule.lambda_trigger[each.key].name
  arn      = aws_lambda_function.service.arn
  input    = templatefile("${path.root}/data/lambda_trigger.json.tftpl", { client = each.key })
}

