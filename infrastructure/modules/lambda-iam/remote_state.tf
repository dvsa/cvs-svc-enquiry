# Acquire the parent (core) config
data "terraform_remote_state" "core" {
  backend   = "s3"
  workspace = coalesce(var.parent_environment, local.environment)
  config = {
    bucket               = "cvs-tf-state-${var.region}"
    dynamodb_table       = "cvs-tf-state-${var.region}"
    region               = var.region
    key                  = "cvs-tf-core"
    workspace_key_prefix = var.account
  }
}