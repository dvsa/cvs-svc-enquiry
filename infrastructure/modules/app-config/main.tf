resource "aws_appconfig_environment" "app_config_environment" {
  name           = terraform.workspace
  description    = "Contains all the feature flags for ${terraform.workspace}"
  application_id = var.app_config_id

  # monitor {
  #   alarm_arn      = aws_cloudwatch_metric_alarm.example.arn
  #   alarm_role_arn = aws_iam_role.example.arn
  # }

  tags = local.tags
}
