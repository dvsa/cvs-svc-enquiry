resource "aws_sns_topic" "deadletter_alarm" {
  name = "${local.csi}-alarm"
  tags = local.default_tags
}
