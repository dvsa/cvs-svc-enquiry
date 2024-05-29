resource "aws_iam_role" "eventbridge" {
  name               = "${local.csi}-eb"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  tags               = local.default_tags
}
