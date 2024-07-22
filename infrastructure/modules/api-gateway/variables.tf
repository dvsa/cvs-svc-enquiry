variable "parent_api" {
  type        = string
  description = "API ID for the Parent Gateway"
}

variable "service_version" {
  type        = string
  description = "API Version for the Service"
  default     = null
}

variable "default_tags" {
  type        = map(string)
  description = "Tags to apply to resources"
}

variable "enable_cw_alarms" {
  type        = bool
  description = "Should CloudWatch Alarms be enabled?"
}

variable "api_service_name" {
  type        = string
  description = "The name of the API Service"
}

variable "api_resources" {
  type        = list(string)
  description = "List of API Resources to create"
}

variable "authorizer_id" {
  type        = string
  description = "Environment specific Lambda Authorizer ID"
}

variable "lambda_uri" {
  type        = string
  description = "The URI to access the Lambda Function"
}

variable "api_doc" {
  type        = string
  description = "OpenAPI Document (in YAML format) for the API Gateway"
}