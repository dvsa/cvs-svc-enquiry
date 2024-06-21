
## Document Feed
resource "aws_s3_bucket" "document_feed" {
  bucket = "cvs-${var.api_service_name}-document-feed-${terraform.workspace}"

  force_destroy = var.force_destroy

  tags = {
    Name        = "cvs-${var.api_service_name}-document-feed-${terraform.workspace}"
    Environment = terraform.workspace
  }
}

resource "aws_s3_bucket_logging" "document_feed" {
  bucket        = aws_s3_bucket.document_feed.id
  target_bucket = data.aws_s3_bucket.access_logging.id
  target_prefix = "${aws_s3_bucket.document_feed.bucket}/"
}

resource "aws_s3_bucket_versioning" "document_feed" {
  bucket = aws_s3_bucket.document_feed.id
  versioning_configuration {
    status = "Suspended"
  }
}

resource "aws_s3_bucket_ownership_controls" "enable_acl_document_feed" {
  bucket = aws_s3_bucket.document_feed.id
  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket_acl" "document_feed" {
  depends_on = [aws_s3_bucket_ownership_controls.enable_acl_document_feed]
  bucket     = aws_s3_bucket.document_feed.id
  acl        = "private"
}

resource "aws_s3_bucket_public_access_block" "document_feed" {
  bucket                  = data.aws_s3_bucket.access_logging.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# resource "aws_s3_bucket_server_side_encryption_configuration" "document_feed" {
#   bucket   = aws_s3_bucket.document_feed.bucket
#
#   rule {
#     apply_server_side_encryption_by_default {
#       sse_algorithm = "AES256"
#     }
#   }
# }

resource "aws_s3_bucket_policy" "document_feed" {
  bucket = aws_s3_bucket.document_feed.id
  policy = data.aws_iam_policy_document.document_feed_https.json
}

data "aws_iam_policy_document" "document_feed_https" {
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
      "${aws_s3_bucket.document_feed.arn}/*",
      aws_s3_bucket.document_feed.arn
    ]

    condition {
      test     = "Bool"
      values   = ["false"]
      variable = "aws:SecureTransport"
    }
  }
}

resource "aws_s3_bucket_notification" "feed_bucket_notification" {
  bucket = aws_s3_bucket.document_feed.id

  lambda_function {
    lambda_function_arn = module.sftp_file_push.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "EVL_GVT_"
    filter_suffix       = ".csv"
  }

  queue {
    queue_arn     = "arn:aws:sqs:eu-west-1:${data.aws_caller_identity.current.account_id}:cert-gov-notify-${terraform.workspace}-queue"
    events        = ["s3:ObjectCreated:*"]
    filter_prefix = "VOSA-"
    filter_suffix = ".csv"
  }

  //depends_on = [aws_lambda_permission.allow_bucket]
}
