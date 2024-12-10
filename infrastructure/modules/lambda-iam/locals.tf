locals {
  csi_name = replace(
    format(
      "%s-%s-%s-%s",
      var.project,
      local.environment,
      var.module,
      var.name,
    ),
    "_",
    "",
  )

  # CSI for use in resources with a global namespace, i.e. S3 Buckets
  csi = replace(
    format(
      "%s-%s-%s-%s-%s",
      var.project,
      data.aws_caller_identity.current.account_id,
      data.aws_region.current.name,
      local.environment,
      var.module,
    ),
    "_",
    "",
  )

  tags = {
    Module      = format(local.name.resource, var.name)
  }

  subnet_ids = data.terraform_remote_state.core.outputs["private_subnets"]
  lambda_sgs = data.terraform_remote_state.core.outputs["lambda_security_group_id"]

  default_env_vars = {
    BRANCH = local.environment
  }
  vpc_config    = length(local.lambda_sgs) > 0 && length(local.subnet_ids) > 0 ? { enabled = { security_group_ids = local.lambda_sgs, subnet_ids = local.subnet_ids } } : {}
  bucket_prefix = length(var.s3_prefix) == 0 ? var.name : var.s3_prefix

}
