resource "aws_api_gateway_rest_api" "service" {
  name = "${var.api_service_name}-${terraform.workspace}"
  binary_media_types = ["application/octet-stream"]
  tags = var.default_tags
}

resource "aws_api_gateway_gateway_response" "default_error" {
  for_each      = toset(["4XX", "5XX"])
  rest_api_id   = aws_api_gateway_rest_api.service.id
  response_type = "DEFAULT_${each.value}"

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Methods" : "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
    "gatewayresponse.header.Access-Control-Allow-Origin" : "'*'",
    "gatewayresponse.header.Access-Control-Allow-Headers" : "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }
}

resource "aws_api_gateway_model" "EmptySchema" {
  rest_api_id  = aws_api_gateway_rest_api.service.id
  name         = "EmptySchema"
  description  = "Empty Schema"
  content_type = "application/json"

  schema = jsonencode(
    {
      title = "Empty Schema"
      type  = "object"
    }
  )
}

resource "aws_api_gateway_deployment" "service" {
  rest_api_id = aws_api_gateway_rest_api.service.id
  triggers = {
      spec      = sha1(jsonencode([aws_api_gateway_integration.service]))
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

resource "aws_api_gateway_method_settings" "settings" {
  rest_api_id = aws_api_gateway_stage.service.rest_api_id
  stage_name  = aws_api_gateway_stage.service.stage_name
  method_path = "*/*"

  settings {
    data_trace_enabled = true
    logging_level      = "INFO"
    metrics_enabled    = true
  }
}

resource "aws_api_gateway_resource" "service" {
  for_each    = toset(var.api_resources)
  parent_id   = aws_api_gateway_rest_api.service.root_resource_id
  path_part   = each.key
  rest_api_id = aws_api_gateway_rest_api.service.id
}

resource "aws_api_gateway_method" "service" {
  for_each         = toset(var.api_resources)
  authorization    = "NONE"
  http_method      = "ANY"
  resource_id      = aws_api_gateway_resource.service[each.key].id
  rest_api_id      = aws_api_gateway_rest_api.service.id
}


resource "aws_api_gateway_method_response" "response_200" {
  for_each    = toset(var.api_resources)
  rest_api_id = aws_api_gateway_rest_api.service.id
  resource_id = aws_api_gateway_resource.service[each.key].id
  http_method = aws_api_gateway_method.service[each.key].http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Methods" : true,
    "method.response.header.Access-Control-Allow-Headers" : true,
    "method.response.header.Access-Control-Allow-Origin" : true
  }
  response_models = {
    "application/json" = aws_api_gateway_model.EmptySchema.name
  }
}

resource "aws_api_gateway_integration" "service" {
  for_each                = toset(var.api_resources)
  rest_api_id             = aws_api_gateway_rest_api.service.id
  resource_id             = aws_api_gateway_resource.service[each.key].id
  http_method             = aws_api_gateway_method.service[each.key].http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  timeout_milliseconds    = 29000
  passthrough_behavior    = "WHEN_NO_MATCH"
  content_handling        = "CONVERT_TO_TEXT"
  uri                     = var.lambda_uri
}

resource "aws_api_gateway_integration_response" "service" {
  for_each    = toset(var.api_resources)
  rest_api_id = aws_api_gateway_rest_api.service.id
  resource_id = aws_api_gateway_resource.service[each.key].id
  http_method = aws_api_gateway_method.service[each.key].http_method
  status_code = aws_api_gateway_method_response.response_200[each.key].status_code
  depends_on = [
    aws_api_gateway_integration.service
  ]
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