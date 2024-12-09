resource "aws_iam_role" "main" {
  name = local.csi_name

  assume_role_policy = data.aws_iam_policy_document.assumerole.json

  tags = merge(
    {
      "Name" = "${local.csi}/${var.service_name}",
    },
  )
}

resource "aws_iam_role_policy_attachment" "role-policy-attachment-default" {
  for_each   = toset(concat(local.default_iam_policies, var.managed_policies))
  role       = aws_iam_role.main.name
  policy_arn = each.value
}

resource "aws_iam_role_policy" "role-policy-attachment-managed" {
  count  = var.custom_policy_enabled ? 1 : 0
  name   = "${var.service_map.name}-custom-policy"
  role   = aws_iam_role.main.name
  policy = var.custom_policy
}
