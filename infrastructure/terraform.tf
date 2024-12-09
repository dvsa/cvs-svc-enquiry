terraform {
  required_version = "~>1.0"
  backend "s3" {
    bucket         = "cvs-svc-enquiry-tf"
    key            = "tf_state"
    region         = "eu-west-1"
    dynamodb_table = "cvs-svc-enquiry-tf"
    profile        = "mgmt"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.35.0"
    }
  }
}

provider "aws" {
  region = var.default_region
  assume_role {
    role_arn = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/${var.TERRAFORM_ROLE}"
  }
  default_tags {
    tags = local.default_tags
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::${var.AWS_ACCOUNT_ID}:role/${var.TERRAFORM_ROLE}"
  }
  default_tags {
    tags = local.default_tags
  }
}

provider "aws" {
  region = var.default_region
  alias  = "mgmt"

  assume_role {
    role_arn = "arn:aws:iam::${var.MGMT_ACCOUNT_ID}:role/${var.TERRAFORM_ROLE}"
  }
  default_tags {
    tags = local.default_tags
  }
}

locals {
  default_tags = {
    Env        = terraform.workspace
    Project    = var.project
    Service    = format("%s-%s-%s-%s", var.project, "svc", var.service, "tf")
    Managed_By = "terraform"
  }
}