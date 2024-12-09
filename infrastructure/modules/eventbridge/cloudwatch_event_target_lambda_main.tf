resource "aws_cloudwatch_event_target" "lambda_target_no_schedule" {
  count          = var.endpoint_url == "" ? 1 : 0
  event_bus_name = var.event_bus_name
  arn            = var.event_target_lambda
  rule           = aws_cloudwatch_event_rule.main.name
  target_id      = local.csi

  retry_policy {
    maximum_retry_attempts       = 10
    maximum_event_age_in_seconds = 14400
  }

  dead_letter_config {
    arn = aws_sqs_queue.dlq.arn
  }
}
