data "aws_iam_policy_document" "read_app_config" {
  for_each    = data.aws_appconfig_environment.environment
  statement {
    effect    = "Allow"
    actions   = [
      "appconfig:StartConfigurationSession",
      "appconfig:GetLatestConfiguration",
    ]
    resources = [
      "arn:aws:appconfig:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:application/${each.value.application_id}/environment/${each.value.environment_id}/*"
    ]
  }
}

resource "aws_iam_role_policy" "role-policy-attachment-app-config" {
  for_each = toset([ for environment in keys(data.aws_appconfig_environment.environment) : environment if var.read_from_app_config ])
  name     = "${var.project}-${terraform.workspace}-${var.name}-read-app-config-${each.value}"
  role     = aws_iam_role.main.name
  policy   = data.aws_iam_policy_document.read_app_config[each.value].json
}

output "config" {
  value = data.aws_appconfig_environment.environment
}