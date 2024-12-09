variable "region" {
  type    = string
  default = "eu-west-1"
}
variable "account_id" {
  type = string
}

variable "region_name" {
  type = string
}

variable "r53_zone_id" {
  type = string
}

variable "s3_bucket" {
  type        = string
  default     = "cvs-services"
  description = "The S3 bucket to pull the lambda zip from, defaults to `cvs-services`"
}

variable "log_arn" {
  type = string
}

variable "cert_arn" {
  type = string
}

variable "domain" {
  type = string
}

variable "api_prefix" {
  type = string
}

variable "lambdas" {
  type = map(string)
}

variable "authorizer_credentials_arn" {
  type = string
}

variable "csi" {
  type = string
}

variable "template_vars" {
  type = map(string)
}

variable "is_feature" {
  type        = bool
  description = "true if is a feature environment"
}