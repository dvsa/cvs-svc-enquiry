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
}

