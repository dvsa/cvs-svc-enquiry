resource "aws_cloudwatch_event_target" "main" {
  count          = var.endpoint_url != "" ? 1 : 0
  arn            = aws_cloudwatch_event_api_destination.main[count.index].arn
  rule           = aws_cloudwatch_event_rule.main.name
  role_arn       = aws_iam_role.eventbridge.arn
  event_bus_name = var.event_bus_name

  retry_policy {
    maximum_retry_attempts       = 10
    maximum_event_age_in_seconds = 14400
  }


  input_transformer {
    input_paths = merge(
      { "event_id" = "$.id" },
      { for path in var.input_path : path => "$.detail.${path}" }
    )
    input_template = var.target_input_template
  }

  dead_letter_config {
    arn = aws_sqs_queue.dlq.arn
  }
}
