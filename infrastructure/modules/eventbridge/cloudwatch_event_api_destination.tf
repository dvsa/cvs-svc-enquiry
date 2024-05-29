resource "aws_cloudwatch_event_api_destination" "main" {
  count                            = var.endpoint_url != "" ? 1 : 0
  name                             = local.csi
  description                      = "An API Destination"
  invocation_endpoint              = var.endpoint_url
  http_method                      = "POST"
  invocation_rate_limit_per_second = 20
  connection_arn                   = aws_cloudwatch_event_connection.main[count.index].arn
}
