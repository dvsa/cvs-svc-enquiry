# Common Variables across this Service

# Service Variables
project = "cvs"
service = "enquiry"
api_version = "v1"
api_spec_ver = "0.0.1"

# Web Access
domain = "cvs.dvsacloud.uk"

# List of API Resources that will be created
api_resources = [
  "testResults",
  "vehicle"
]

# List of Scheduled Tasks to create
scheduled_tasks = [
  "evl", 
  "tfl"
]

# Schduling - The day(s) that the task will run
schedule_day  = {
  evl = "MON-SAT"
  tfl = "SUN"
}