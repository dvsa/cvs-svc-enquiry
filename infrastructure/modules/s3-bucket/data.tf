
data "aws_s3_bucket" "access_logging" {
  #checkov:skip=CKV_AWS_144:This bucket does not require cross region replication.
  bucket = "cvs-s3-access-logs-${terraform.workspace}"
}

data "aws_iam_policy_document" "bucket_https" {
  statement {
    effect = "Deny"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    actions = [
      "s3:*",
    ]

    resources = [
      "${aws_s3_bucket.bucket.arn}/*",
      aws_s3_bucket.bucket.arn
    ]

    condition {
      test     = "Bool"
      values   = ["false"]
      variable = "aws:SecureTransport"
    }
  }
}