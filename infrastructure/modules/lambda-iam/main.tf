resource "aws_lambda_function" "service" {
  function_name = "${var.service_map.name}-${terraform.workspace}"
  s3_bucket     = data.aws_s3_object.service.bucket
  s3_key        = data.aws_s3_object.service.key

  # This should be generated from the zip file as follows:
  # openssl dgst -sha256 -binary lambda.zip | openssl enc -base64
  source_code_hash = data.aws_s3_object.service.metadata.sha256sum

  handler                        = var.service_map.handler
  runtime                        = var.runtime
  role                           = aws_iam_role.main.arn
  description                    = "${var.service_map.description} ${terraform.workspace}"
  memory_size                    = var.service_map.memory
  timeout                        = var.service_map.timeout
  reserved_concurrent_executions = var.concurrent_executions
  dynamic "vpc_config" {
    for_each = local.vpc_config
    content {
      security_group_ids = vpc_config.value["security_group_ids"]
      subnet_ids         = vpc_config.value["subnet_ids"]
    }
  }

  tracing_config {
    mode = "Active"
  }

  environment {
    variables = merge(local.default_env_vars, var.additional_env_vars)
  }

  dynamic "dead_letter_config" {
    for_each = var.dlq_arn == "" ? [] : [var.dlq_arn]
    content {
      target_arn = var.dlq_arn
    }
  }

  tags = local.tags

  depends_on = [
    aws_cloudwatch_log_group.logs
  ]
}

resource "aws_cloudwatch_log_group" "logs" {
  name              = "/aws/lambda/${var.service_map.name}-${terraform.workspace}"
  retention_in_days = var.log_retention_days
  tags              = local.tags
}
