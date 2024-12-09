variable "resource_id" {
  type = string
}

variable "api_id" {
  type = string
}

variable "lambda_name" {
  type    = string
  default = null
}

variable "account_id" {
  type = string
}

variable "verb" {
  type    = string
  default = "ANY"
}

variable "include_option" {
  type    = bool
  default = true
}

variable "include_verb" {
  type    = bool
  default = true
}
