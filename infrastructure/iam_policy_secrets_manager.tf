resource "aws_iam_policy" "secret_manager" {
  for_each    = { 
    enquiry = ["rds-lambda-auth*"]
    enquiry_evl_push_file = ["sftp_poc/evl_config*", "sftp_poc/tfl_config*"]
  }
  name        = "${local.csi}-${each.key}_secret_manager"
  description = "Access Secret manager"
  policy      = templatefile("./data/iam_secrets_manager.json.tftpl", { resource = [ for arn in each.value : "arn:aws:secretsmanager:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:secret:${var.environment}/${arn}" ] })
}

resource "aws_iam_role_policy_attachment" "enquiry_evl_push_file_secret" {
  role       = module.enquiry_sftp_file_push.role_name
  policy_arn = aws_iam_policy.secret_manager["enquiry_evl_push_file"].arn
}

resource "aws_iam_role_policy_attachment" "get_enquiry_secret" {
  role       = module.enquiry_lambda.role_name
  policy_arn = aws_iam_policy.secret_manager["enquiry"].arn
}
