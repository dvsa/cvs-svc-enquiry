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
  region = "eu-west-1"
  assume_role {
    role_arn = "arn:aws:iam::${var.AWS_ACCOUNT}:role/TerraformRole"
  }
  default_tags {
    tags = local.tags
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::${var.AWS_ACCOUNT}:role/TerraformRole"
  }
  default_tags {
    tags = local.tags
  }
}

provider "aws" {
  region = "eu-west-1"
  alias  = "mgmt"

  assume_role {
    role_arn = "arn:aws:iam::${var.MGMT_ACCOUNT}:role/TerraformRole"
  }
  default_tags {
    tags = local.tags
  }
}
