data "aws_s3_objects" "service_hashes" {
  bucket = var.s3_bucket
  prefix = "${local.bucket_prefix}/latestHash_${terraform.workspace}"
}

data "aws_s3_object" "service_hash" {
  bucket = var.s3_bucket
  key = try(data.aws_s3_objects.service_hashes.keys[0], "${local.bucket_prefix}/latestHash_develop.txt")
}

data "aws_s3_object" "service" {
  bucket = var.s3_bucket
  key    = "${local.bucket_prefix}/${data.aws_s3_object.service_hash.body}.zip"
}