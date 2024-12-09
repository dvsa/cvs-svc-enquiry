variable "bucket_name" {
  description = "Name of s3 bucket"
  type        = string
}

variable "bucket_logging_target_bucket" {
  description = "Access Logging bucket name to enable bucket access logging or not"
  type        = string
  default     = null
}