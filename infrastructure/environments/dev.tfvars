AWS_ENVIRONMENT = "dev"

scheduled_tasks = {
  evl = {
    day    = "MON-SAT"
    hour   = 19
    minute = 0
  }
  tfl = {
    day    = "SUN"
    hour   = 19
    minute = 0
  }
}

create_appconfig_profile = true