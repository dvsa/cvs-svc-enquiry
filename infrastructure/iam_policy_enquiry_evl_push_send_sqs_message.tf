data "aws_iam_policy_document" "enquiry_evl_push_send_sqs_message" {
  statement {
    sid    = "SendMessage"
    effect = "Allow"

    actions = [
      "SQS:SendMessage",
      "SQS:GetQueueUrl",
      "SQS:GetQueueAttributes"
    ]

    resources = [
      aws_sqs_queue.enquiry_evl_push_lambda.arn
    ]
  }
}

resource "aws_iam_policy" "send_enquiry_evl_push_sqs_message" {
  name        = "${local.csi}-enquiry_evl_file_push_send-sqs-message"
  description = "Enquiry EVL File Push Send SQS Message"
  policy      = data.aws_iam_policy_document.enquiry_evl_push_send_sqs_message.json
}

resource "aws_iam_role_policy_attachment" "allow_enquiry_evl_push_lambda_send_message" {
  role       = module.enquiry_sftp_file_push.role_name
  policy_arn = aws_iam_policy.send_enquiry_evl_push_sqs_message.arn
}

