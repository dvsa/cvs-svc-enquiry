data "terraform_remote_state" "current_or_dev" {
  backend   = "s3"
  workspace = terraform.workspace
  config = {
    bucket         = "cvs-tf-environment"
    key            = "tf_state"
    region         = "eu-west-1"
    dynamodb_table = "cvs-tf-environment"
    profile        = "mgmt"
  }
}

data "aws_api_gateway_rest_api" "parent" {
  name = terraform.workspace
}

# Root Path for the service on the parent Gateway (e.g. `/v1/enquiry`)
data "aws_api_gateway_resource" "version" {
  rest_api_id = data.aws_api_gateway_rest_api.parent.id
  path        = "/${var.service_version}"
}

data "aws_api_gateway_authorizer" "lambda_auth" {
  rest_api_id      = data.aws_api_gateway_rest_api.parent.id
  authorizer_id    = data.terraform_remote_state.current_or_dev.outputs.lambda_authorizer_id
}
