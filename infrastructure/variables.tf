## Environment Variables expected as TV_VAR_XXX values from pipeline
variable "AWS_ACCOUNT" {
  type        = string
  description = "The AWS Environment Type (prod or nonprod)"
  default     = "nonprod"
  validation  {
    condition = contains(["nonprod", "prod"], var.AWS_ACCOUNT)
    error_message = "Environment must be one of `nonprod` or `prod`"
  }
}

variable "AWS_ACCOUNT_ID" {
  type        = string
  description = "The AWS Account ID to deploy to"
}

variable "MGMT_ACCOUNT_ID" {
  type        = string
  description = "The Management AWS Account ID"
}

variable "AWS_ENVIRONMENT" {
  type        = string
  description = "AWS Environment (`feature`, `develop`, `integration`, `preprod`, `prod`)"
  validation  {
    condition = contains(["feature", "develop", "integration", "preprod", "prod"], var.AWS_ENVIRONMENT)
    error_message = "Environment must be one of `feature`, `develop`, `integration`, `preprod` or `prod`"
  }
}

variable "TERRAFORM_ROLE" {
  type        = string
  description = "AWS Role Name for Terraform Activity"
}

variable "REMOTE_STATE" {
  type        = string
  description = "Remote State Environment to use for collecting externally managed resources"
}

## Service Variables
variable "service" {
  type        = string
  description = "Name of the API Service (e.g. `defects`, `enquiry`)"
}

variable "project" {
  type        = string
  description = "The DVSA Project that this code belongs to"
  default     = "cvs"
}

variable "component" {
  type        = string
  description = "The name of the tfscaffold component"
  default     = "tf"
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

variable "api_resources" {
  type        = list(string)
  description = "List of API Resources to create"
}

# AWS Settings
variable "default_region" {
  type        = string
  description = "Default AWS Region for resources"
  default     = "eu-west-1"
}

# Web Access
variable "domain" {
  type        = string
  description = "The Application Domain"
  default     = "cvs.dvsacloud.uk"
}

variable "sub_domain" {
  type        = string
  description = "The SubDomain to apply to the Application Domain"
  default     = "develop"
}

# Scheduled Tasks
variable "scheduled_tasks" {
  type        = list(string)
  description = "List of Scheduled Tasks to create"
  default     = null
}

variable "schedule_day" {
  type        = map(string)
  description = "Collection of Days on which to run Lambda on Schedule per service. Key must match service name."
  default     = {}
}

variable "schedule_hour" {
  type        = number
  description = "Hours on which to run Lambda on Schedule"
  default     = null
}

variable "schedule_min" {
  type        = number
  description = "Minute Identifier on which to run Lambda on Schedule"
  default     = 0
}

## Deployment Flags
variable "enable_firehose" {
  type        = bool
  description = "Should Firehose be enabled?"
  default     = false
}

variable "enable_api_cw_alarms" {
  type        = bool
  description = "Should we enable CloudWatch Alarms"
  default     = false
}

variable "force_destroy" {
  type        = bool
  description = "Should we ensure resources are destroyed?"
  default     = true
}
