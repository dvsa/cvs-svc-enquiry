resource "aws_s3_bucket" "bucket" {
  bucket = var.bucket_name
  force_destroy = var.force_destroy
  tags = {
    Name        = var.bucket_name
    Environment = terraform.workspace
  }
}

resource "aws_s3_bucket_policy" "bucket" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.bucket_https.json
}

resource "aws_s3_bucket_server_side_encryption_configuration" "bucket" {
  bucket   = aws_s3_bucket.bucket.bucket
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = var.encryption_algorithm
    }
  }
}

resource "aws_s3_bucket_versioning" "bucket" {
  bucket = aws_s3_bucket.bucket.id
  versioning_configuration {
    status = var.bucket_versioning_status
  }
}

resource "aws_s3_bucket_ownership_controls" "enable_acl_bucket" {
  bucket = aws_s3_bucket.bucket.id
  rule {
    object_ownership = var.bucket_owner
  }
}

resource "aws_s3_bucket_acl" "bucket" {
  depends_on = [aws_s3_bucket_ownership_controls.enable_acl_bucket]
  bucket     = aws_s3_bucket.bucket.id
  acl        = var.bucket_acl
}

resource "aws_s3_bucket_logging" "bucket" {
  bucket        = aws_s3_bucket.bucket.id
  target_bucket = data.aws_s3_bucket.access_logging.id
  target_prefix = "${aws_s3_bucket.bucket.bucket}/"
}

resource "aws_s3_bucket_notification" "feed_bucket_notification" {
  count  = length(var.lambda_notifications)
  bucket = aws_s3_bucket.bucket.id
  
  dynamic "lambda_function" {
    for_each = var.lambda_notifications
    content {
      lambda_function_arn = lambda_function.value["arn"]
      events              = split(",", lambda_function.value["events"])
      filter_prefix       = lambda_function.value["filter_prefix"]
      filter_suffix       = lambda_function.value["filter_suffix"]
    }
  }

  dynamic "queue" {
    for_each = var.sqs_notifications != null ? [ var.sqs_notifications ] : []
    content {
      queue_arn     = queue.value["arn"]
      events        = split(",", queue.value["events"])
      filter_prefix = queue.value["filter_prefix"]
      filter_suffix = queue.value["filter_suffix"]
    }
  }

  dynamic "topic" {
    for_each = var.sns_notifications != null ? [ var.sns_notifications ] : []
    content {
      topic_arn     = topic.value.arn
      events        = split(",", topic.value.events)
      filter_prefix = topic.value.filter_prefix
      filter_suffix = topic.value.filter_suffix
    }
  }
}
