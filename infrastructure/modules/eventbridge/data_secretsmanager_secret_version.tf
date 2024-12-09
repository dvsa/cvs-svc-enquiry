data "aws_secretsmanager_secret_version" "api_key" {
  count     = var.secret_env_name != "" ? 1 : 0
  secret_id = "${var.secret_env_name}/${var.api_key}"
}
