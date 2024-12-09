locals {
  csi_name = replace(
    format(
      "%s-%s-%s-%s-%s",
      var.DVSA_PROJECT,
      var.AWS_ENVIRONMENT,
      var.component,
      var.module,
      var.name,
    ),
    "_",
    "",
  )

  # CSI for use in resources with a global namespace, i.e. S3 Buckets
  csi = replace(
    format(
      "%s-%s-%s-%s-%s-%s",
      var.DVSA_PROJECT,
      data.aws_caller_identity.current.account_id,
      data.aws_region.current.name,
      var.AWS_ENVIRONMENT,
      var.component,
      var.module,
    ),
    "_",
    "",
  )

  tags = {
    Component   = var.component
    Project     = var.DVSA_PROJECT
    Name        = "${var.DVSA_PROJECT}-${var.AWS_ENVIRONMENT}-${var.name}/api"
    Environment = var.AWS_ENVIRONMENT
    Module      = format("%s-%s-%s", var.DVSA_PROJECT, var.name, var.component)
  }

  subnet_ids = data.terraform_remote_state.current_or_dev.outputs["private_subnets"]
  lambda_sgs = data.terraform_remote_state.current_or_dev.outputs["lambda_sg"]

  default_env_vars = {
    BRANCH = var.AWS_ENVIRONMENT
  }
  vpc_config    = length(local.lambda_sgs) > 0 && length(local.subnet_ids) > 0 ? { enabled = { security_group_ids = local.lambda_sgs, subnet_ids = local.subnet_ids } } : {}
  bucket_prefix = length(var.s3_prefix) == 0 ? var.name : var.s3_prefix
  
}
