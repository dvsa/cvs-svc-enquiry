resource "aws_sqs_queue" "dlq" {
  name                      = "${local.csi}-dlq"
  message_retention_seconds = var.message_retention_seconds
  tags                      = local.default_tags
  sqs_managed_sse_enabled   = true
}
