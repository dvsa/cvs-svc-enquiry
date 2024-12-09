resource "aws_cloudwatch_event_rule" "enquiry_lambda_trigger" {
  for_each            = toset(["evl", "tfl"])
  name                = "${terraform.workspace}-trigger-${each.value}-feed-every-day"
  description         = "${var.schedule_day[each.value]} at ${var.schedule_hour[var.aws_environment]}00hrs"
  schedule_expression = "cron(0 ${var.schedule_hour[var.aws_environment]} ? * ${var.schedule_day[each.value]} *)"
}

resource "aws_cloudwatch_event_target" "enquiry_lambda_trigger" {
  for_each = toset(["evl", "tfl"])
  rule     = aws_cloudwatch_event_rule.enquiry_lambda_trigger[each.value].name
  arn      = module.enquiry_lambda.arn
  input    = templatefile("./data/enquiry_lambda_trigger.json.tftpl", { client = each.value })
}

