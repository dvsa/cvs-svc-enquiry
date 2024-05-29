data "aws_iam_policy_document" "sns_topic_policy" {
  policy_id = "AllowDeadLetterQueueAlarm"

  statement {
    sid    = "AllowDeadLetterQueueAlarm"
    effect = "Allow"

    actions = [
      "SNS:Subscribe",
      "SNS:SetTopicAttributes",
      "SNS:RemovePermission",
      "SNS:Receive",
      "SNS:Publish",
      "SNS:ListSubscriptionsByTopic",
      "SNS:GetTopicAttributes",
      "SNS:DeleteTopic",
      "SNS:AddPermission",
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceOwner"

      values = [
        var.aws_account_id,
      ]
    }

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    resources = [
      aws_sns_topic.deadletter_alarm.arn,
    ]
  }
}
