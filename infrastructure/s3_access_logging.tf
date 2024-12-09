data "aws_kms_key" "access_logging_s3" {
  key_id = "alias/s3-access-logging-${terraform.workspace}"
}

data "aws_s3_bucket" "access_logging" {
  #checkov:skip=CKV_AWS_144:This bucket does not require cross region replication.
  bucket        = "cvs-s3-access-logs-${terraform.workspace}"
}