resource "aws_cloudwatch_metric_alarm" "lambda_alarm" {
  for_each            = toset([ for alarm in ["timeout", "errors", "deadletter"] : alarm if var.cloudwatch_alarms.enabled ])
  alarm_name          = "${var.name}-${terraform.workspace}-${title(each.value)}"
  alarm_description   = "Lambda ${each.value} alarm"
  comparison_operator = var.cloudwatch_alarms[each.value].comparison_operator
  evaluation_periods  = var.cloudwatch_alarms[each.value].evaluation_periods
  threshold           = var.cloudwatch_alarms[each.value].threshold
  period              = var.cloudwatch_alarms[each.value].period
  unit                = var.cloudwatch_alarms[each.value].unit
  namespace           = var.cloudwatch_alarms[each.value].namespace
  metric_name         = var.cloudwatch_alarms[each.value].metric_name
  statistic           = var.cloudwatch_alarms[each.value].statistic
  dimensions          = var.cloudwatch_alarms[each.value].dimensions
  treat_missing_data  = var.cloudwatch_alarms[each.value].treat_missing_data
  lifecycle {
    ignore_changes = [alarm_actions]
  }
}
