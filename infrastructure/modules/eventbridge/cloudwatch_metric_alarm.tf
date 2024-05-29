resource "aws_cloudwatch_metric_alarm" "deadletter_alarm" {
  alarm_name          = "${aws_sqs_queue.dlq.name}-not-empty-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/Events"
  period              = "300"
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "Items are on the ${aws_sqs_queue.dlq.name} queue"
  alarm_actions       = [aws_sns_topic.deadletter_alarm.arn]
  treat_missing_data  = "notBreaching"
  tags                = local.default_tags
  dimensions = {
    "QueueName" = aws_sqs_queue.dlq.name
  }
}
