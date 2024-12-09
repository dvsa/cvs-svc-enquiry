data "aws_iam_policy_document" "read_app_config" {
  statement {
    effect    = "Allow"
    actions   = [
      "appconfig:StartConfigurationSession",
      "appconfig:GetLatestConfiguration",
    ]
    resources = [
      "arn:aws:appconfig:${var.region}:${var.aws_account_id}:application/${var.app_config_id}/environment/${var.app_config_environment_id}/*"
    ]
  }
}

resource "aws_iam_role_policy" "role-policy-attachment-app-config" {
  count  = var.read_from_app_config ? 1 : 0
  name   = "${var.service_map.name}-read-app-config"
  role   = aws_iam_role.main.name
  policy = data.aws_iam_policy_document.read_app_config.json
}
