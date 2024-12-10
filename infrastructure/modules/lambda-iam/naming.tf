locals {
  name = {
    # Create default naming convention for CloudWatch Logs
    # Final Naming convention: `cvs/[AWS_SERVICE]/[NAME]/[REGION]`
    cloudwatch = format("%s/%s/%%s/%%s/%s", var.project, local.environment, var.region)

    # Create default Resource naming Convention
    # Final naming conventions: `cvs-[AWS_SERVICE]-[ENVIRONMENT]-[REGION]
    resource = format("%s-%s-%%s-%s", var.project, local.environment, var.region)

    # Create Availability-Zone Resource naming Convention
    # Final naming conventions: `cvs-[AWS_SERVICE]-[ENVIRONMENT]-[AVAILABILITY_ZONE]
    az_resource = format("%s-%s-%%s-%%s", var.project, local.environment)
  }
}