variable "s3_bucket" {
  type        = string
  default     = "cvs-services"
  description = "The S3 bucket to pull the lambda zip from, defaults to `cvs-services`"
}

variable "service_map" {
  type = object({
    name        = string,
    version     = string,
    handler     = string,
    description = string,
    component   = string
    memory      = number,
    timeout     = number,
  })
  description = "Pass the service map from environment here, certain values will be stripped off as they are not used."
}

variable "runtime" {
  type        = string
  default     = "nodejs18.x"
  description = "The lambda runtime, defaults to `nodejs14.x`"
}

variable "managed_policies" {
  type        = list(string)
  default     = []
  description = "List of aws managed Iam policies to be attached to lambda"
}

variable "custom_policy" {
  description = "custom policy"
  type        = string
  default     = ""
}

variable "custom_policy_enabled" {
  type    = bool
  default = true
}

variable "lambda_sgs" {
  type        = list(string)
  default     = []
  description = "A list of security group ids"
}

variable "subnet_ids" {
  type        = list(string)
  default     = []
  description = "A list of subnet ids"
}

variable "additional_env_vars" {
  type        = map(string)
  default     = {}
  description = "A map of key value pairs for environment variables."
}

variable "region" {
  type        = string
  default     = "eu-west-1"
  description = "The AWS region to deploy into. Defaults to `eu-west-1`"
}

variable "concurrent_executions" {
  type        = number
  default     = null
  description = "Lambda concurrency"
}

variable "project" {
  type        = string
  description = "The name of the tfscaffold project"
}

variable "component" {
  type        = string
  description = "The name of the tfscaffold component"
}

variable "environment" {
  type        = string
  description = "The name of the tfscaffold environment"
}

variable "module" {
  type        = string
  description = "The name of the module"
  default     = "eventbridge"
}

variable "aws_account_id" {
  type        = string
  description = "The AWS Account ID (numeric)"
}

variable "service_name" {
  type        = string
  description = "Name of the Service"
}


variable "principal_services" {
  type        = list(string)
  description = "A list of service names allowed to invoke lambda. Accepted values: apigateway, events"
  default     = [""]
}

variable "invoker_source_arns" {
  type        = list(string)
  description = "A list of arn of the Principal Service"
  default     = [""]
}

variable "dlq_arn" {
  type        = string
  description = "Arn for DLQ"
  default     = ""
}

variable "s3_prefix" {
  type    = string
  default = ""
}

variable "timeout_alarm_threshold" {
  type    = number
  default = 1
}

variable "timeout_alarm_evaluation_periods" {
  type    = number
  default = 2
}

variable "timeout_alarm_period" {
  type    = number
  default = 60
}

variable "errors_alarm_threshold" {
  type    = number
  default = 1
}

variable "errors_alarm_evaluation_periods" {
  type    = number
  default = 2
}

variable "errors_alarm_period" {
  type    = number
  default = 60
}

variable "log_retention_days" {
  type    = number
  default = 90
}

variable "read_from_app_config" {
  type    = bool
  default = false
}

variable "app_config_id" {
  type    = string
  default = ""
}

variable "app_config_environment_id" {
  type    = string
  default = ""
}
