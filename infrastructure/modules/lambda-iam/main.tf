resource "aws_lambda_function" "service" {
  function_name = "${var.name}-${terraform.workspace}"
  s3_bucket     = data.aws_s3_object.service.bucket
  s3_key        = data.aws_s3_object.service.key

  # This should be generated from the zip file as follows:
  # openssl dgst -sha256 -binary lambda.zip | openssl enc -base64
  source_code_hash = data.aws_s3_object.service.metadata.sha256sum

  handler                        = var.handler
  runtime                        = var.runtime
  role                           = aws_iam_role.main.arn
  description                    = "${var.description} ${terraform.workspace}"
  memory_size                    = var.memory
  timeout                        = var.timeout
  reserved_concurrent_executions = var.concurrent_executions

  dynamic "vpc_config" {
    for_each = local.vpc_config
    content {
      security_group_ids = vpc_config.value["security_group_ids"]
      subnet_ids         = vpc_config.value["subnet_ids"]
    }
  }

  tracing_config {
    mode = var.lambda_tracing_config
  }

  environment {
    variables = merge(local.default_env_vars, var.additional_env_vars)
  }

  dynamic "dead_letter_config" {
    for_each = aws_sqs_queue.dead_letter
    content {
      target_arn = dead_letter_config.value.arn
    }
  }

  tags = local.tags

  depends_on = [
    aws_cloudwatch_log_group.logs
  ]
}

resource "aws_sqs_queue" "dead_letter" {
  count                     = var.dead_letter_required ? 1 : 0
  name                      = "${var.project}-${terraform.workspace}-${var.name}-dlq"
  message_retention_seconds = var.dead_letter_retention
  tags                      = local.tags
  sqs_managed_sse_enabled   = var.dead_letter_managed_sse
}

resource "aws_cloudwatch_log_group" "logs" {
  name              = "/aws/${var.module}/${var.name}-${terraform.workspace}"
  retention_in_days = var.log_retention_days
  tags              = local.tags
}

## SQS Policies
resource "aws_iam_policy" "push_sqs_message" {
  count       = var.dead_letter_required ? 1 : 0
  name        = "${var.project}-${terraform.workspace}-${var.name}-send-sqs-message-dlq"
  description = "${replace(title(var.name), "-", " ")} EVL File Send SQS Message to DLQ"
  policy      = templatefile("${path.module}/data/iam_sqs_send.json.tftpl", { arn = aws_sqs_queue.dead_letter[count.index].arn })
}

resource "aws_iam_role_policy_attachment" "allow_evl_push_lambda_send_message" {
  count      = var.dead_letter_required ? 1 : 0
  role       = aws_iam_role.main.name
  policy_arn = aws_iam_policy.push_sqs_message[count.index].arn
}