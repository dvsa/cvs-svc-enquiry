AWS_ENVIRONMENT = "prod"

scheduled_tasks = {
  evl = {
    day    = "MON-SAT"
    hour   = 23
    minute = 0
  }
  tfl = {
    day    = "SUN"
    hour   = 23
    minute = 0
  }
}

cloudwatch_alarms = {
  enabled = true
}