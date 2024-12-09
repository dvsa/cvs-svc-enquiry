data "aws_iam_policy_document" "read_s3_enquiry" {
  statement {
    sid    = "CVSS3BucketRead"
    effect = "Allow"

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "${aws_s3_bucket.enquiry_document_feed.arn}/*",
    ]
  }
}

resource "aws_iam_policy" "read_s3_enquiry" {
  name        = "${local.csi}-read-s3-enquiry-document"
  description = "Read S3 Enquiry Document"
  policy      = data.aws_iam_policy_document.read_s3_enquiry.json
}

resource "aws_iam_role_policy_attachment" "read_enquiry_bucket" {
  role       = module.enquiry_sftp_file_push.role_name
  policy_arn = aws_iam_policy.read_s3_enquiry.arn
}
