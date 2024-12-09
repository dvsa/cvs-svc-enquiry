## S3 Policies
resource "aws_iam_policy" "s3" {
  for_each    = toset(["read", "write"])
  name        = "${local.csi}-${each.value}-s3-${var.api_service_name}-document"
  description = "${ title(each.value) } S3 ${title(var.api_service_name)} Document"
  policy      = templatefile("./data/iam_s3.json.tftpl", { action = each.value, arn = aws_s3_bucket.document_feed.arn })
}


resource "aws_iam_role_policy_attachment" "read_bucket" {
  role       = module.sftp_file_push.role_name
  policy_arn = aws_iam_policy.s3["read"].arn
}

resource "aws_iam_role_policy_attachment" "document_feed" {
  role       = module.enquiry_lambda.role_name
  policy_arn = aws_iam_policy.s3["write"].arn
}

## Secrets Manager Policies
resource "aws_iam_policy" "secret_manager" {
  for_each    = { 
    "${var.api_service_name}" = ["rds-lambda-auth*"]
    evl_push_file = ["sftp_poc/evl_config*", "sftp_poc/tfl_config*"]
  }
  name        = "${local.csi}-${each.key}_secret_manager"
  description = "Access Secret manager"
  policy      = templatefile("./data/iam_secrets_manager.json.tftpl", { resource = [ for arn in each.value : "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.environment == "feature" ? "nonprod" : var.environment}/${arn}" ] })
}

resource "aws_iam_role_policy_attachment" "evl_push_file_secret" {
  role       = module.sftp_file_push.role_name
  policy_arn = aws_iam_policy.secret_manager["evl_push_file"].arn
}

resource "aws_iam_role_policy_attachment" "get_secret" {
  role       = module.enquiry_lambda.role_name
  policy_arn = aws_iam_policy.secret_manager[var.api_service_name].arn
}

## SQS Policies
resource "aws_iam_policy" "send_evl_push_sqs_message" {
  name        = "${local.csi}-evl_file_push_send-sqs-message"
  description = "${title(var.api_service_name)} EVL File Push Send SQS Message"
  policy      = templatefile("./data/iam_sqs_send.json.tftpl", { arn = aws_sqs_queue.evl_push_lambda.arn })
}

resource "aws_iam_role_policy_attachment" "allow_evl_push_lambda_send_message" {
  role       = module.sftp_file_push.role_name
  policy_arn = aws_iam_policy.send_evl_push_sqs_message.arn
}

