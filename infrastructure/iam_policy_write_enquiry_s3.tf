data "aws_iam_policy_document" "read_write_s3_enquiry" {
  statement {
    sid    = "CVSS3BucketRead"
    effect = "Allow"

    actions = [
      "s3:PutObject",
      "s3:GetObject"
    ]

    resources = [
      aws_s3_bucket.enquiry_document_feed.arn,
      "${aws_s3_bucket.enquiry_document_feed.arn}/*",
    ]
  }
}

resource "aws_iam_policy" "read_write_s3_enquiry" {
  name        = "${local.csi}-write-s3-enquiry-document"
  description = "Read Write S3 Enquiry Document"
  policy      = data.aws_iam_policy_document.read_write_s3_enquiry.json
}

resource "aws_iam_role_policy_attachment" "enquiry_document_feed" {
  role       = module.enquiry_lambda.role_name
  policy_arn = aws_iam_policy.read_write_s3_enquiry.arn
}
