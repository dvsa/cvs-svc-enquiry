resource "aws_cloudwatch_event_rule" "main" {
  name           = local.csi
  description    = var.description
  event_bus_name = var.event_bus_name
  event_pattern  = var.rule_event_pattern
}
