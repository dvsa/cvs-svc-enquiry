locals {

  # Compound Scope Identifier
  csi = replace(
    format(
      "%s-%s-%s",
      var.project,
      terraform.workspace,
      var.component,
    ),
    "_",
    "",
  )

  # CSI for use in resources with a global namespace, i.e. S3 Buckets
  csi_global = replace(
    format(
      "%s-%s-%s-%s-%s",
      var.project,
      var.AWS_ACCOUNT,
      var.region,
      terraform.workspace,
      var.component,
    ),
    "_",
    "",
  )

  tags = {
    Env        = terraform.workspace
    Project    = "cvs"
    Service    = "cvs-svc-${var.api_service_name}-tf"
    Managed_By = "terraform"
  }

  domain = "${var.sub_domain}.${var.domain}"
  default_tags = local.tags

  cfs_buckets   = ["csv", "documents"]


  logs_service_map = {
    name        = "logs"
    version     = terraform.workspace
    handler     = "functions/postLogs/framework/handler.handler"
    description = "Logs Service"
    component   = "log"
    memory      = 128
    timeout     = 30
  }

  enable_firehose = var.enable_firehose ? { (terraform.workspace) = terraform.workspace } : {}

  subnet_ids = data.terraform_remote_state.current_or_dev.outputs["private_subnets"]
  lambda_sgs = data.terraform_remote_state.current_or_dev.outputs["lambda_sg"]

  api_resources = toset([
    "testResults",
    "vehicle"
  ])

  scheduled_tasks = toset([
    "evl", 
    "tfl"
  ]) 
}