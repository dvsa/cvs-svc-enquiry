# Document Feed Bucket
module "document_feed" {
  source  = "./modules/s3-bucket"
  name = "document-feed"
  region = var.AWS_REGION
  force_destroy  = var.force_destroy
  lambda_notifications = [{
      arn           = module.sftp_file_push.arn
      events        = "s3:ObjectCreated:*"
      filter_prefix = "EVL_GVT_"
      filter_suffix = ".csv"
    }]

  sqs_notifications = {
    enabled       = true
    arn           = "arn:aws:sqs:${var.AWS_REGION}:${local.aws_account_id}:cert-gov-notify-${var.AWS_ENVIRONMENT}-queue"
    events        = "s3:ObjectCreated:*"
    filter_prefix = "VOSA-"
    filter_suffix = ".csv"
  }
}

# SFTP Push Lambda
module "sftp_file_push" {
  source         = "./modules/lambda-iam"
  name           = "sftp-file-push"
  description    = "Push S3 data feed to SFTP ${var.AWS_ENVIRONMENT}"
  account        = local.aws_account_name
  region         = var.AWS_REGION
  s3_prefix      = "${var.DVSA_SERVICE}-evl-file-push"
  handler        = "handler/s3Event.handler"
  memory         = 5000
  timeout        = 30

  lambda_triggers  = {
    bucket = {
      arn = module.document_feed.bucket_arn
      principal = "s3.amazonaws.com"
    }
  }

  additional_env_vars = {
    EVL_SFTP_CONFIG = "feature/sftp_poc/evl_config"
    EVL_SFTP_SEND   = "false"
    EVL_SFTP_PATH   = "evl"
    TFL_SFTP_CONFIG = "feature/sftp_poc/tfl_config"
    TFL_SFTP_SEND   = "false"
    TFL_SFTP_PATH   = "tfl"
  }

  cloudwatch_alarms = {
    enabled = true
    timeout = {
      dimensions = {
        Environment = var.AWS_ENVIRONMENT
        Service     = "/aws/lambda/${var.DVSA_SERVICE}"
      }
    }
    errors = {
      dimensions = {
        FunctionName = var.DVSA_SERVICE
      }
    }
  }
}
