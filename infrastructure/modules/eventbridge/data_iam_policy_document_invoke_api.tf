data "aws_iam_policy_document" "eventbridge_invoke_api" {
  count = var.endpoint_url != "" ? 1 : 0
  statement {
    sid    = "Allow${var.name}ToPushEvents"
    effect = "Allow"

    actions = [
      "events:InvokeApiDestination"
    ]

    resources = [
      aws_cloudwatch_event_api_destination.main[count.index].arn
    ]
  }
}
