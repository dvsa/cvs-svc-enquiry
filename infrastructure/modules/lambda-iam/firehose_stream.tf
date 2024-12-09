resource "aws_cloudwatch_log_subscription_filter" "filter" {
  for_each        = var.enable_firehose ? toset(terraform.workspace) : []
  log_group_name  = aws_cloudwatch_log_group.logs.name
  name            = "${var.project}-${terraform.workspace}-${var.name}-${terraform.workspace}-metrics"
  destination_arn = data.aws_kinesis_firehose_delivery_stream.firehose_metrics[each.value].arn
  role_arn        = data.aws_iam_role.firehose_metrics[each.value].arn
  filter_pattern  = ""
}