resource "aws_cloudwatch_metric_alarm" "lambda_timeouts" {
  count               = local.is_main_env ? 1 : 0
  alarm_name          = "${var.service_map.name}-${terraform.workspace}-Timeouts"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = var.timeout_alarm_evaluation_periods
  threshold           = var.timeout_alarm_threshold
  period              = var.timeout_alarm_period
  unit                = "Count"

  namespace   = "CVS"
  metric_name = "Timeouts"
  statistic   = "Maximum"
  dimensions = {
    Environment = terraform.workspace
    Service     = "/aws/lambda/${var.service_map.name}"
  }
  lifecycle {
    ignore_changes = [alarm_actions]
  }
}

resource "aws_cloudwatch_metric_alarm" "lambda_errors" {
  count               = local.is_main_env ? 1 : 0
  alarm_name          = "${var.service_map.name}-${terraform.workspace}-Errors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = var.errors_alarm_evaluation_periods
  threshold           = var.errors_alarm_threshold
  period              = var.errors_alarm_period
  unit                = "Count"
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  statistic           = "Maximum"
  dimensions = {
    FunctionName = var.service_map.name
  }
  lifecycle {
    ignore_changes = [alarm_actions]
  }
}