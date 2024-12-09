data "aws_iam_policy_document" "enquiry_secret_manager" {
  statement {
    sid    = "AllowSecretManager"
    effect = "Allow"

    actions = [
      "secretsmanager:ListSecrets",
      "secretsmanager:DescribeSecret",
      "secretsmanager:GetSecretValue",
    ]
    resources = ["arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.aws_environment}/rds-lambda-auth*"]
  }
}

resource "aws_iam_policy" "enquiry_secret_manager" {
  name        = "${local.csi}-enquiry_secret_manager"
  description = "Access Secret manager"
  policy      = data.aws_iam_policy_document.enquiry_secret_manager.json
}

resource "aws_iam_role_policy_attachment" "get_enquiry_secret" {
  role       = module.enquiry_lambda.role_name
  policy_arn = aws_iam_policy.enquiry_secret_manager.arn
}