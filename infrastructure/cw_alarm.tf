locals {
  service_name = "${local.csi}-enquiry-evl-push-lambda"
}

resource "aws_sqs_queue" "enquiry_evl_push_lambda" {
  name                      = "${local.service_name}-dlq"
  message_retention_seconds = 1209600
  tags                      = local.default_tags
  sqs_managed_sse_enabled   = true
}

resource "aws_cloudwatch_metric_alarm" "deadletter_alarm_enquiry_evl_push_lambda" {
  alarm_name          = "${local.service_name}-dlq-not-empty-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "ApproximateNumberOfMessagesVisible"
  namespace           = "AWS/SQS"
  period              = "120"
  statistic           = "Sum"
  threshold           = "1"
  alarm_description   = "Items are on the ${aws_sqs_queue.enquiry_evl_push_lambda.name} queue"
  treat_missing_data  = "notBreaching"
  tags                = local.default_tags
  dimensions = {
    "QueueName" = aws_sqs_queue.enquiry_evl_push_lambda.name
  }
}

resource "aws_cloudwatch_metric_alarm" "enquiry_evl_push_lambda_errors" {
  alarm_name          = "${local.service_name}-errors-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  threshold           = 1
  period              = 60
  unit                = "Count"

  namespace   = "AWS/Lambda"
  metric_name = "Errors"
  statistic   = "Maximum"
  dimensions = {
    FunctionName = module.enquiry_sftp_file_push.function_name
  }
}

resource "aws_cloudwatch_metric_alarm" "enquiry_evl_push_lambda_timeouts" {
  alarm_name          = "${local.service_name}-timeouts-alarm"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  threshold           = 1
  period              = 60
  unit                = "Count"

  namespace   = "CVS"
  metric_name = "Timeouts"
  statistic   = "Maximum"
  dimensions = {
    Environment = terraform.workspace
    Service     = "/aws/lambda/${module.enquiry_sftp_file_push.function_name}"
  }
}