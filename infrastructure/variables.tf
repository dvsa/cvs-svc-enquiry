# Core Variables expected as TV_VAR_XXX values from pipeline
variable "AWS_REGION" {
  type        = string
  description = "AWS Region in which to deploy resources"
}

variable "AWS_ACCOUNTS" {
  type        = string
  description = "JSON Encoded AWS Account information"
}

variable "AWS_ENVIRONMENT" {
  type        = string
  description = "AWS Environment Name"
}

variable "DVSA_PROJECT" {
  type        = string
  description = "DVSA Project Name"
}

variable "DVSA_SERVICE" {
  type        = string
  description = "DVSA Service Boundary"
}

variable "TERRAFORM_ROLE" {
  type        = string
  description = "ARN of the AWS IAM Role responsible for running Terraform Activities"
}

# Terraform Environment Information
variable "management_env" {
  type        = string
  description = "Name of the Management Environment"
  default     = "mgmt"
}

variable "parent_environment" {
  type        = string
  description = "Parent Environment Name (if required)"
  default     = null
}

# API Configuration
variable "api_spec_ver" {
  type        = string
  description = "The API Spec Version"
  default     = "0.0.1"
}

variable "api_version" {
  type        = string
  description = "DVSA API Version to deploy Service Into"
  default     = "v1"
}

# Cloudwatch Alarms
variable "cloudwatch_alarms" {
  type        = object({
    enabled            = optional(bool, false)
    operator           = optional(string, "GreaterThanOrEqualToThreshold")
    evaluation_periods = optional(number, 2)
    threshold          = optional(number, 1)
    period             = optional(number, 60)
    unit               = optional(string, "Count")
    statistic          = optional(string, "Maximum")
  })
  description = "Configuration for Cloudwatch Alarms"
  default     = {}
}

# Create Scheduled Tasks
variable "scheduled_tasks" {
  type        = map(object({
    day    = string
    hour   = number
    minute = number
  }))
  description = "Collection of Scheduled Tasks to create"
  default     = {}
}


# Lambda Services
variable "lambda_services" {
  type        = list(string)
  description = "List of Services hosted within the Lambda"
}

## Deployment Flags
variable "enable_firehose" {
  type        = bool
  description = "Should Firehose be enabled?"
  default     = false
}

variable "force_destroy" {
  type        = bool
  description = "Should we ensure resources are destroyed?"
  default     = true
}
