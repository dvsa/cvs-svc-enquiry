resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.this_gateway.id
  # triggers = {
  #   spec      = module.apigw.redeployment_spec
  #   workspace = terraform.workspace
  # }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "stage" {
  rest_api_id          = aws_api_gateway_rest_api.this_gateway.id
  deployment_id        = aws_api_gateway_deployment.deployment.id
  stage_name           = "v1"
  xray_tracing_enabled = true

  tags = {
    Environment = terraform.workspace
  }
  depends_on = [aws_api_gateway_deployment.deployment]
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_method_settings" "settings" {
  rest_api_id = aws_api_gateway_stage.stage.rest_api_id
  stage_name  = aws_api_gateway_stage.stage.stage_name
  method_path = "*/*"

  settings {
    data_trace_enabled = true
    logging_level      = "INFO"
    metrics_enabled    = true
  }
}

# resource "aws_api_gateway_base_path_mapping" "main" {
#   api_id      = aws_api_gateway_stage.stage.rest_api_id
#   stage_name  = aws_api_gateway_stage.stage.stage_name
#   domain_name = local.api_domain
#   base_path   = aws_api_gateway_stage.stage.stage_name
#   depends_on  = [aws_api_gateway_stage.stage]
#   lifecycle {
#     create_before_destroy = true
#   }
# }

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