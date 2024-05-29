##
# Basic Required Variabless
##

variable "project" {
  type        = string
  description = "The name of the tfscaffold project"
}

variable "environment" {
  type        = string
  description = "The name of the tfscaffold environment"
}

variable "component" {
  type        = string
  description = "The name of the tfscaffold component"
}

variable "aws_account_id" {
  type        = string
  description = "The AWS Account ID (numeric)"
}

variable "region" {
  type        = string
  description = "The AWS Region"
}

variable "module" {
  type        = string
  description = "The name of the module"
  default     = "eventbridge"
}

variable "default_tags" {
  description = "The default tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "is_prod" {
  type        = bool
  description = "Is prod?"
}

variable "is_main_env" {
  type        = bool
  description = "Is main?"
}

variable "is_develop" {
  type        = bool
  description = "Is develop?"
}

variable "is_feature" {
  type        = bool
  description = "Is feature?"
}

variable "account_id" {
  type        = string
  description = "The AWS Account ID"
}

variable "acct_ids" {
  type        = map(string)
  description = "The AWS Account IDs"
}

variable "message_retention_seconds" {
  type        = number
  default     = 1209600
  description = "The number of seconds Amazon SQS retains a message"
}

variable "secret_env_name" {
  type        = string
  description = "Secret Environment Name"
  default     = ""
}

variable "endpoint_url" {
  type        = string
  description = "CloudWatch event API destination endpoint URL"
  default     = ""
}

variable "service_name" {
  type        = string
  description = "Name of the Service"
}

variable "name" {
  type        = string
  description = "Service Name without space"
}

variable "auth_endpoint" {
  type        = string
  description = "CloudWatch event connection authorization endpoint"
  default     = ""
}

variable "oauth_key" {
  type        = string
  description = "CloudWatch event connection Oauth http body's key"
  default     = ""
}

variable "oauth_value" {
  type        = string
  description = "CloudWatch event connection Oauth http body's value"
  default     = ""
}

variable "description" {
  type        = string
  description = "CloudWatch event rule description"
}

variable "iam_role" {
  type        = string
  description = "Lambda Exec Role Name"
}

variable "api_key" {
  type        = string
  description = "Secret Name API key"
  default     = ""
}

variable "rule_event_pattern" {
  type        = any
  description = "Event pattern described a JSON object"
}

variable "input_path" {
  type        = list(string)
  description = "Key value pairs specified in the form of JSONPath for event target"
}

variable "target_input_template" {
  type        = any
  description = "JSON Template to customize data sent to the event target"
}

variable "rule_schedule_expression" {
  type        = string
  description = "CloudWatch Event rule schedule expression"
  default     = ""
}

variable "event_target_lambda" {
  type        = string
  description = "Event Target Lambda ARN"
}

variable "is_enabled" {
  type        = string
  description = "Optional Resource"
}

variable "event_bus_name" {
  type        = string
  description = "Event Bus name"
}
