data "aws_iam_policy_document" "assume_role" {

  statement {
    sid     = "AllowEventBridgeToAssumeRole"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["events.amazonaws.com"]
    }
  }
}
