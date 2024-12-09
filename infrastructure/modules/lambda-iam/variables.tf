variable "name" {
  type        = string
  description = "Name of the Lambda"
}

variable "handler" {
  type        = string
  description = "Internal Handler for the Lambda"
}

variable "description" {
  type        = string
  description = "Lambda Description"
}

variable "s3_bucket" {
  type        = string
  description = "The S3 bucket to pull the lambda zip from, defaults to `cvs-services`"
  default     = "cvs-services"
}

variable "runtime" {
  type        = string
  description = "The lambda runtime, defaults to `nodejs18.x`"
  default     = "nodejs18.x"
}

variable "managed_policies" {
  type        = list(string)
  description = "List of aws managed Iam policies to be attached to lambda"
  default     = []
}

variable "custom_policy" {
  type        = string
  description = "Custom Policy"
  default     = ""
}

variable "custom_policy_enabled" {
  type        = bool
  description = "Is a Custom Policy Enabled"
  default     = false
}

variable "additional_env_vars" {
  type        = map(string)
  description = "A map of key value pairs for environment variables."
  default     = {}
}

variable "concurrent_executions" {
  type        = number
  description = "Lambda concurrency"
  default     = null
}

variable "project" {
  type        = string
  description = "The name of Project"
  default     = "cvs"
}

variable "component" {
  type        = string
  description = "The name of the Component"
  default     = "tf"
}

variable "environment" {
  type        = string
  description = "The name of the Environment"
}

variable "module" {
  type        = string
  description = "The name of the module"
  default     = "lambda"
}

variable "scheduled_tasks" {
  type        = set(string)
  description = "List of Scheduled Tasks to create"
  default     = []
}

variable "schedule_day" {
  type        = map(string)
  description = "Days on which to run Lambda on Schedule"
  default     = {
    evl = "MON-SAT"
    tfl = "SUN"
  }
}

variable "schedule_hour" {
  type        = number
  description = "Hours on which to run Lambda on Schedule"
  default     = null
}

variable "schedule_min" {
  type        = number
  description = "Minute to run Lambda on Schedule"
  default     = 0
}

variable "lambda_triggers" {
  type        = map(map(string))
  description = "A collection of Lambda Triggers"
}

variable "lambda_tracing_config" {
  type        = string
  description = "Tracing Configuration for Lambda (`PassThrough` or `Active` - Default: Active)"
  default     = "Active"
}

variable "dead_letter_required" {
  type        = bool
  description = "Is a Dead Letter Queue required"
  default     = true
}

variable "dead_letter_retention" {
  type        = number
  description = "Dead Letter Queue Retention (seconds)"
  default     = 1209600
}

variable "dead_letter_managed_sse" {
  type        = bool
  description = "Should Managed Server-Side Encryption be enabled for DLQ"
  default     = true
}

variable "s3_prefix" {
  type    = string
  default = ""
}

# CloudWatch Alarm Data
variable "cloudwatch_alarms" {
  type    = object({
    enabled = optional(bool, false)
    timeout = optional(object({
      evaluation_periods  = optional(number, 2)
      period              = optional(number, 60)
      threshold           = optional(number, 1)
      unit                = optional(string, "Count")
      statistic           = optional(string, "Maximum")
      treat_missing_data  = optional(string, null)
      metric_name         = optional(string, "Timeouts")
      comparison_operator = optional(string, "GreaterThanOrEqualToThreshold")
      namespace           = optional(string, "CVS")
      dimensions          = optional(map(string), {})
    }), {
      evaluation_periods  = 2
      period              = 60
      threshold           = 1
      unit                = "Count"
      statistic           = "Maximum"
      treat_missing_data  = null
      metric_name         = "Timeouts"
      comparison_operator = "GreaterThanOrEqualToThreshold"
      namespace           = "CVS"
      dimensions          = {}
    })
    errors = optional(object({
      evaluation_periods  = optional(number, 2)
      period              = optional(number, 60)
      threshold           = optional(number, 1)
      unit                = optional(string, "Count")
      statistic           = optional(string, "Maximum")
      treat_missing_data  = optional(string, null)
      metric_name         = optional(string, "Errors")
      comparison_operator = optional(string, "GreaterThanOrEqualToThreshold")
      namespace           = optional(string, "CVS")
      dimensions          = optional(map(string), {})
    }), {
      evaluation_periods  = 2
      period              = 60
      threshold           = 1
      unit                = "Count"
      statistic           = "Maximum"
      treat_missing_data  = null
      metric_name         = "Errors"
      comparison_operator = "GreaterThanOrEqualToThreshold"
      namespace           = "CVS"
      dimensions          = {}
    })
    deadletter = optional(object({
      evaluation_periods  = optional(number, 1)
      period              = optional(number, 120)
      threshold           = optional(number, 1)
      unit                = optional(string, null)
      statistic           = optional(string, "Sum")
      treat_missing_data  = optional(string, "notBreaching")
      metric_name         = optional(string, "ApproximateNumberOfMessagesVisible")
      comparison_operator = optional(string, "GreaterThanOrEqualToThreshold")
      namespace           = optional(string, "AWS/SQS")
      dimensions          = optional(map(string), {})
    }), {
      evaluation_periods  = 1
      period              = 120
      threshold           = 1
      unit                = null
      statistic           = "Sum"
      treat_missing_data  = "notBreaching"
      metric_name         = "ApproximateNumberOfMessagesVisible"
      comparison_operator = "GreaterThanOrEqualToThreshold"
      namespace           = "AWS/SQS"
      dimensions          = {}
    })
  })
  description = "Collection of Items for a CloudWatch Alarms"
}

variable "log_retention_days" {
  type    = number
  default = 90
}

variable "read_from_app_config" {
  type    = bool
  default = true
}

variable "app_config_id" {
  type    = string
  default = "j7jocye"
}

variable "memory" {
  type        = number
  description = "Amount of Memory to allocate for the Lambda"
  default     = 1024
}

variable "timeout" {
  type        = number
  description = "Lambda Timeout (seconds)"
  default     = 60
}

variable "default_iam_policies" {
  type        = list(string)
  description = "List of default IAM Policies to assign"
  default     = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole",
    "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess",
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  ]
}

variable "enable_firehose" {
  type        = bool
  description = "Should Firehose be enabled?"
  default     = false
}

variable "aws_environment" {
  type        = string
  description = "The AWS Environment Type (prod or nonprod)"
  default     = "nonprod"
}
