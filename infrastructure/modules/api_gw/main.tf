resource "aws_api_gateway_rest_api" "apigw" {
  name = terraform.workspace

  binary_media_types = ["application/octet-stream"]
  policy             = local.incapsula_env ? data.aws_iam_policy_document.api_gw_policy.json : null
  tags               = { Environment = terraform.workspace }
}

data "aws_iam_policy_document" "api_gw_policy" {
  statement {
    effect = "Allow"

    principals {
      identifiers = [
        "*",
      ]

      type = "*"
    }

    actions = [
      "execute-api:Invoke",
    ]

    resources = [
      "arn:aws:execute-api:${var.region_name}:${var.account_id}:*",
    ]

    condition {
      test     = "IpAddress"
      values   = var.valid_ips
      variable = "aws:SourceIp"
    }
  }

  statement {
    effect = "Deny"

    principals {
      identifiers = [
        "*",
      ]

      type = "*"
    }

    actions = [
      "execute-api:Invoke",
    ]

    resources = [
      "arn:aws:execute-api:${var.region_name}:${var.account_id}:*",
    ]

    condition {
      test     = "NotIpAddress"
      values   = var.valid_ips
      variable = "aws:SourceIp"
    }
  }
}


resource "aws_api_gateway_domain_name" "domain_name" {
  domain_name     = "${var.api_prefix}.${var.domain}"
  certificate_arn = var.cert_arn
  security_policy = "TLS_1_2"
  tags = {
    Environment = terraform.workspace
  }
}

//noinspection ConflictingProperties
resource "aws_route53_record" "api" {
  zone_id = var.r53_zone_id
  name    = var.api_prefix
  type    = local.incapsula_env ? "CNAME" : "A"

  //noinspection ConflictingProperties
  dynamic "alias" {
    for_each = local.incapsula_env ? {} : { incapsula = true }
    content {
      evaluate_target_health = true
      name                   = aws_api_gateway_domain_name.domain_name.cloudfront_domain_name
      zone_id                = aws_api_gateway_domain_name.domain_name.cloudfront_zone_id
    }
  }
  records = local.incapsula_env ? local.incapsula_map[terraform.workspace] : null
  ttl     = local.incapsula_env ? 300 : null
}

resource "aws_route53_record" "imperva_api" {
  count   = local.incapsula_env ? 1 : 0
  zone_id = var.r53_zone_id
  name    = "imperva-api"
  type    = "A"
  alias {
    evaluate_target_health = true
    name                   = aws_api_gateway_domain_name.domain_name.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.domain_name.cloudfront_zone_id
  }
}

resource "aws_iam_role" "invocation_role" {
  name = "${terraform.workspace}-api_gateway_auth_invocation"
  path = "/"

  assume_role_policy = data.aws_iam_policy_document.allow_apigw_assume.json
  tags = {
    Environment = terraform.workspace
  }
}

resource "aws_iam_role_policy" "invocation_policy" {
  role   = aws_iam_role.invocation_role.id
  policy = data.aws_iam_policy_document.allow_invoke_auth.json
}

resource "aws_api_gateway_gateway_response" "default_4xx" {
  rest_api_id   = aws_api_gateway_rest_api.apigw.id
  response_type = "DEFAULT_4XX"

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Methods" : "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
    "gatewayresponse.header.Access-Control-Allow-Origin" : "'*'",
    "gatewayresponse.header.Access-Control-Allow-Headers" : "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }
}

resource "aws_api_gateway_gateway_response" "default_5xx" {
  rest_api_id   = aws_api_gateway_rest_api.apigw.id
  response_type = "DEFAULT_5XX"

  response_templates = {
    "application/json" = "{\"message\":$context.error.messageString}"
  }

  response_parameters = {
    "gatewayresponse.header.Access-Control-Allow-Methods" : "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
    "gatewayresponse.header.Access-Control-Allow-Origin" : "'*'",
    "gatewayresponse.header.Access-Control-Allow-Headers" : "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
  }
}

resource "aws_iam_role" "apigw_s3_cvs_signature_access_role" {
  name               = "apigw_s3_cvs_signature_${terraform.workspace}"
  assume_role_policy = data.aws_iam_policy_document.allow_apigw_assume.json
  tags = {
    Environment = terraform.workspace
  }
}

resource "aws_iam_role_policy" "s3_cvs_signature_access_policy" {
  policy = data.aws_iam_policy_document.s3_cvs_signature.json
  role   = aws_iam_role.apigw_s3_cvs_signature_access_role.name
}

data "aws_iam_policy_document" "s3_cvs_signature" {

  statement {
    effect = "Allow"

    actions = [
      "s3:PutObject",
      "s3:GetObject",
    ]

    resources = [
      var.is_feature ? "arn:aws:s3:::cvs-signature-develop/*" : "arn:aws:s3:::cvs-signature-${terraform.workspace}/*"
    ]
  }
}