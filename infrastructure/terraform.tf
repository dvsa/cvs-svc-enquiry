terraform {
  required_version = "~>1.0"
  backend "s3" {
    # Backend Configuration requires the `workspace_key_prefix` to be set externally - see https://github.com/dvsa/cvs-tf-core/wiki
    # This value should correspond to the AWS Account name
    bucket         = "cvs-tf-state-eu-west-2"
    dynamodb_table = "cvs-tf-state-eu-west-2"
    region         = "eu-west-2"
    key            = "cvs-enquiry"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.35"
    }

    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.AWS_REGION
  default_tags {
    tags = {
      Env        = var.AWS_ENVIRONMENT
      Project    = var.DVSA_PROJECT
      Service    = var.DVSA_SERVICE
      Managed_By = "terraform"
    }
  }
}

provider "aws" {
  region = var.AWS_REGION
  alias  = "mgmt"
  assume_role {
    role_arn = "arn:aws:iam::${local.aws_accounts[var.management_env].id}:role/${local.terraform_role}"
  }
  default_tags {
    tags = {
      Env        = var.management_env
      Project    = var.DVSA_PROJECT
      Service    = var.DVSA_SERVICE
      Managed_By = "terraform"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "global"
  default_tags {
    tags = {
      Env        = var.AWS_ENVIRONMENT
      Project    = var.DVSA_PROJECT
      Service    = var.DVSA_SERVICE
      Managed_By = "terraform"
    }
  }
}

# Acquire the parent (core) config
data "terraform_remote_state" "core" {
  backend   = "s3"
  workspace = coalesce(var.parent_environment, var.AWS_ENVIRONMENT)
  config = {
    bucket               = "cvs-tf-state-${var.AWS_REGION}"
    dynamodb_table       = "cvs-tf-state-${var.AWS_REGION}"
    region               = var.AWS_REGION
    key                  = "cvs-tf-core"
    workspace_key_prefix = local.aws_account_name
  }
}

# Local Variables that require calculations
locals {
  name = {
    # Create default naming convention for CloudWatch Logs
    # Final Naming convention: `cvs/[AWS_SERVICE]/[NAME]/[REGION]`
    cloudwatch = format("%s/%s/%%s/%%s/%s", var.DVSA_PROJECT, var.AWS_ENVIRONMENT, var.AWS_REGION)

    # Create default Resource naming Convention
    # Final naming conventions: `cvs-[AWS_SERVICE]-[ENVIRONMENT]-[REGION]
    resource = format("%s-%s-%%s-%s", var.DVSA_PROJECT, var.AWS_ENVIRONMENT, var.AWS_REGION)

    # Create Availability-Zone Resource naming Convention
    # Final naming conventions: `cvs-[AWS_SERVICE]-[ENVIRONMENT]-[AVAILABILITY_ZONE]
    az_resource = format("%s-%s-%%s-%%s", var.DVSA_PROJECT, var.AWS_ENVIRONMENT)
  }

  # Parse the passed in TERRAFORM ROLE
  terraform_role = reverse(split("/", var.TERRAFORM_ROLE))[0]

  # Process inbound json string TF_VAR_AWS_ACCOUNTS
  aws_accounts      = jsondecode(var.AWS_ACCOUNTS)
  aws_account_id    = local.aws_accounts[var.AWS_ENVIRONMENT].id
  aws_account_name  = local.aws_accounts[var.AWS_ENVIRONMENT].name
  aws_account_ids   = { for name in local.aws_account_names : name => one(flatten(distinct([for account in local.aws_accounts : account.id if account.name == name]))) }
  aws_account_names = distinct([for name, account in local.aws_accounts : account.name if name != terraform.workspace])

  # Simplify Data Resources
  api_parent_name    = data.terraform_remote_state.core.outputs.api_gateway_name
  api_authorizer_id  = data.terraform_remote_state.core.outputs.api_authorizer_id
  subnet_ids         = [ for subnet in data.terraform_remote_state.core.outputs.private_subnets : subnet.id ]
  security_group_ids = try(tolist(data.terraform_remote_state.core.outputs.lambda_security_group_id), tolist([data.terraform_remote_state.core.outputs.lambda_security_group_id]))
  appconfig_id       = data.terraform_remote_state.core.outputs.appconfig_application_id
}

# Required Variables that can be set within tfvars files

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
