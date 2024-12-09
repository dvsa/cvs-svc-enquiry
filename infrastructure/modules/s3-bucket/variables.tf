variable "bucket_name" {
  type        = string
  description = "Name of the bucket to create (must be unique across all of AWS S3"
}

variable "force_destroy" {
  type        = bool
  description = "Should destruction of resources be forced"
  default     = true
}

variable "bucket_versioning_status" {
  type        = string
  description = "Status of Bucket Versioning"
  default     = "Suspended"
}

variable "bucket_owner" {
  type        = string
  description = "Ownership Rule for Bucket"
  default     = "ObjectWriter"
}

variable "bucket_acl" {
  type        = string
  description = "External Access List for Bucket"
  default     = "private"
}

variable "block_public_acls" {
  type        = bool
  description = "Block Public Access Lists"
  default     = true
}

variable "block_public_policy" {
  type        = bool
  description = "Block Public Policies"
  default     = true
}

variable "ignore_public_acls" {
  type        = bool
  description = "Ignore Public Access Lists"
  default     = true
}

variable "restrict_public_buckets" {
  type        = bool
  description = "Restrict Public Buckets"
  default     = true
}

variable "encryption_algorithm" {
  type        = string
  description = "Encryption Algorithm to use on Bucket"
  default     = "AES256"
}

variable "lambda_notifications" {
  type = list(object({
    arn = string
    events = string
    filter_prefix = optional(string)
    filter_suffix = optional(string)
  }))
  description = "Collection of Lambda Configuration for an S3 Bucket Notification"
  default     = null
}

variable "sqs_notifications" {
  type = object({
    arn = string
    events = string
    filter_prefix = optional(string)
    filter_suffix = optional(string)
  })
  description = "Collection of SQS Configuration for an S3 Bucket Notification"
  default     = null
}

variable "sns_notifications" {
  type = object({
    arn = string
    events = string
    filter_prefix = optional(string)
    filter_suffix = optional(string)
  })
  description = "Collection of SNS Configuration for an S3 Bucket Notification"
  default = null
}