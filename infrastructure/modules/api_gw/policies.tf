data "aws_iam_policy_document" "allow_apigw_assume" {
  statement {
    sid     = "AllowApiGWToAssumeThisRole"
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      identifiers = ["apigateway.amazonaws.com"]
      type        = "Service"
    }
  }
}

data "aws_iam_policy_document" "allow_invoke_auth" {
  statement {
    effect    = "Allow"
    actions   = ["Lambda:InvokeFunction"]
    resources = ["arn:aws:lambda:${var.region}:${var.account_id}:function:authoriser-*"]
  }
}
