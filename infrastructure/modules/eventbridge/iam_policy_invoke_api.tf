resource "aws_iam_policy" "eventbridge_invoke_api" {
  count  = var.endpoint_url != "" ? 1 : 0
  name   = "${local.csi}-eventbridge-invoke-api"
  policy = data.aws_iam_policy_document.eventbridge_invoke_api[count.index].json
}

resource "aws_iam_role_policy_attachment" "eventbridge_invoke_api" {
  count      = var.endpoint_url != "" ? 1 : 0
  role       = aws_iam_role.eventbridge.name
  policy_arn = aws_iam_policy.eventbridge_invoke_api[count.index].arn
}
