locals {
  csi_name = replace(
    format(
      "%s-%s-%s-%s-%s",
      var.project,
      var.environment,
      var.component,
      var.module,
      var.service_name,
    ),
    "_",
    "",
  )

  # CSI for use in resources with a global namespace, i.e. S3 Buckets
  csi = replace(
    format(
      "%s-%s-%s-%s-%s-%s",
      var.project,
      var.aws_account_id,
      var.region,
      var.environment,
      var.component,
      var.module,
    ),
    "_",
    "",
  )

  tags = {
    Component   = var.service_map.component
    Project     = "cvs"
    Name        = "cvs-${terraform.workspace}-${var.service_map.name}/api"
    Environment = terraform.workspace
    Module      = "cvs-tf-service"
  }

  default_env_vars = {
    BRANCH = terraform.workspace
  }
  vpc_config    = length(var.lambda_sgs) > 0 && length(var.subnet_ids) > 0 ? { enabled = { security_group_ids = var.lambda_sgs, subnet_ids = var.subnet_ids } } : {}
  bucket_prefix = length(var.s3_prefix) == 0 ? var.service_map.name : var.s3_prefix
  default_iam_policies = [
    "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole",
    "arn:aws:iam::aws:policy/AWSXRayDaemonWriteAccess",
    "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  ]

  accounts_to_alert_in = ["prod", "preprod", "integration", "develop"]
  is_main_env          = contains(local.accounts_to_alert_in, terraform.workspace)

  is_feature        = length(regexall("[A-Za-z0-9]+-\\d+", terraform.workspace)) > 0
  is_devops         = length(regexall("^devops$", terraform.workspace)) > 0
  is_develop        = length(regexall("^develop$", terraform.workspace)) > 0
  is_preprod        = length(regexall("^preprod$", terraform.workspace)) > 0
  is_prod           = length(regexall("^prod$", terraform.workspace)) > 0
  is_dev_env        = local.is_feature || local.is_develop || local.is_devops
  is_devops_feature = local.is_feature || local.is_devops
}
