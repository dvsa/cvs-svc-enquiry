data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

resource "aws_api_gateway_rest_api" "service" {
  name               = "${var.api_service_name}-${terraform.workspace}"
  binary_media_types = ["application/octet-stream"]
  body               = templatefile(var.api_doc, {
    environment = terraform.workspace
    region      = data.aws_region.current.name
    account     = data.aws_caller_identity.current.account_id
  })
  tags               = var.default_tags
}

resource "aws_api_gateway_deployment" "service" {
  rest_api_id = aws_api_gateway_rest_api.service.id
  triggers = {
      spec      = sha1(jsonencode([aws_api_gateway_rest_api.service.endpoint_configuration]))
      workspace = terraform.workspace
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "service" {
  rest_api_id          = aws_api_gateway_rest_api.service.id
  deployment_id        = aws_api_gateway_deployment.service.id
  stage_name           = var.service_version
  xray_tracing_enabled = true

  tags = {
    Environment = terraform.workspace
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_cloudwatch_metric_alarm" "api-5XX" {
  count               = var.enable_cw_alarms ? 1 : 0
  alarm_name          = "${terraform.workspace}-API-5XXErrors"
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = 2
  threshold           = 1
  period              = 60
  unit                = "Count"

  namespace   = "AWS/ApiGateway"
  metric_name = "5XXError"
  statistic   = "Maximum"
  dimensions = {
    ApiName = terraform.workspace
  }
}