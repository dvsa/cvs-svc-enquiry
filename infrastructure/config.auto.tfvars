# Service Configuration

# Service Variables
DVSA_PROJECT = "cvs"
DVSA_SERVICE = "cvs-enquiry"
AWS_REGION   = "eu-west-2"
api_version  = "v1"
api_spec_ver = "0.0.1"

# List of services within the Lambda
lambda_services = [
  "testResults",
  "vehicle"
]