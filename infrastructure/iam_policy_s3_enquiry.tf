resource "aws_iam_policy" "s3_enquiry" {
  for_each    = toset(["read", "write"])
  name        = "${local.csi}-${each.value}-s3-enquiry-document"
  description = "${ title(each.value) } S3 Enquiry Document"
  policy      = templatefile("./data/iam_s3_enquiry.json.tftpl", { action = each.value, arn = aws_s3_bucket.enquiry_document_feed.arn })
}


resource "aws_iam_role_policy_attachment" "read_enquiry_bucket" {
  role       = module.enquiry_sftp_file_push.role_name
  policy_arn = aws_iam_policy.s3_enquiry["read"].arn
}

resource "aws_iam_role_policy_attachment" "enquiry_document_feed" {
  role       = module.enquiry_lambda.role_name
  policy_arn = aws_iam_policy.s3_enquiry["write"].arn
}
