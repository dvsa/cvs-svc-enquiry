data "aws_iam_policy_document" "enquiry_evl_push_file_secret_manager" {
  statement {
    sid    = "AllowSecretManager"
    effect = "Allow"

    actions = [
      "secretsmanager:ListSecrets",
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetSecretValue",
    ]
    resources = ["arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.environment}/sftp_poc/tfl_config*",
    "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.environment}/sftp_poc/evl_config*"]
  }
}

resource "aws_iam_policy" "enquiry_evl_push_file_secret_manager" {
  name        = "${local.csi}-enquiry_evl_push_file_secret_manager"
  description = "Access Secret manager"
  policy      = data.aws_iam_policy_document.enquiry_evl_push_file_secret_manager.json
}

resource "aws_iam_role_policy_attachment" "enquiry_evl_push_file_secret" {
  role       = module.enquiry_sftp_file_push.role_name
  policy_arn = aws_iam_policy.enquiry_evl_push_file_secret_manager.arn
}