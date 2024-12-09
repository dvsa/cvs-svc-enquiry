resource "aws_cloudwatch_event_connection" "main" {
  count              = var.auth_endpoint != "" ? 1 : 0
  name               = local.csi
  description        = "A connection description"
  authorization_type = "OAUTH_CLIENT_CREDENTIALS"

  auth_parameters {

    oauth {
      authorization_endpoint = var.auth_endpoint
      http_method            = "POST"

      client_parameters {
        client_id     = jsondecode(data.aws_secretsmanager_secret_version.api_key[count.index].secret_string)["client_id"]
        client_secret = jsondecode(data.aws_secretsmanager_secret_version.api_key[count.index].secret_string)["client_secret"]
      }
      oauth_http_parameters {
        body {
          key   = "grant_type"
          value = "client_credentials"
        }
        body {
          key   = var.oauth_key
          value = var.oauth_value
        }
      }
    }
  }
}
