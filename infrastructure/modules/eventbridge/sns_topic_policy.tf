resource "aws_sns_topic_policy" "topic_policy" {
  arn    = aws_sns_topic.deadletter_alarm.arn
  policy = data.aws_iam_policy_document.sns_topic_policy.json
}
