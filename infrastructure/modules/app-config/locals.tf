locals {
  tags = {
    Component   = "cvs-app-config"
    Project     = "cvs"
    Name        = "cvs-${terraform.workspace}/app-config"
    Environment = terraform.workspace
    Module      = "cvs-tf-service"
  }
}
