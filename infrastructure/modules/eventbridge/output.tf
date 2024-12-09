output "eventbridge_rule_name" {
  value = aws_cloudwatch_event_rule.main.name
}

output "eventbridge_rule_arn" {
  value = aws_cloudwatch_event_rule.main.arn
}

output "eventbridge_target" {
  value = aws_cloudwatch_event_target.main.*.arn
}

output "dlq_alarm_name" {
  value = aws_cloudwatch_metric_alarm.deadletter_alarm.alarm_name
}

output "dlq_arn" {
  value = aws_sqs_queue.dlq.arn
}

output "dlq_name" {
  value = aws_sqs_queue.dlq.name
}
