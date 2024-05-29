## Environment Variables
variable "AWS_ACCOUNT" {
  type        = string
  description = "The AWS Account ID to deploy to"
}

variable "MGMT_ACCOUNT" {
  type        = string
  description = "The Management AWS Account ID"
}

variable "GITHUB_ENVIRONMENT" {
  type        = string
  description = "GitHub Environment"
}

## Standard Variables
variable "aws_environment" {
  type        = string
  description = "The AWS Environment Type (prod or nonprod)"
  default     = "nonprod"
}

variable "remote_state" {
  type        = string
  description = "The Remote State file to acquire"
  default     = "develop"
}
variable "region" {
  type        = string
  description = "The AWS Region"
  default     = "eu-west-1"
}

variable "default_tags" {
  type        = map(string)
  description = "A map of default tags to apply to all taggable resources within the component"
  default     = {}
}

variable "project" {
  type        = string
  description = "The name of the tfscaffold project"
  default     = "cvs"
}

variable "component" {
  type        = string
  description = "The name of the tfscaffold component"
  default     = "tf"
}

variable "domain" {
  type        = string
  description = "The Application Domain"
  default     = "cvs.dvsacloud.uk"
}

variable "sub_domain" {
  type        = string
  description = "The SubDomain to apply to the Application Domain"
  default     = "develop"
}

variable "app_config" {
  type        = map(string)
  description = "App Config Id Map"
  default     = {
    app_config_id  = "j7jocye"
    vtx_profile_id = "t5s9wuc"
    vtm_profile_id = "4j8oc9c"
    vta_profile_id = "mlkqqmj"
  }
}



variable "schedule_day" {
  type        = map(string)
  description = "Days on which to run Lambda on Schedule"
  default     = {
    evl = "MON-SAT"
    tfl = "SUN"
  }
}

variable "schedule_hour" {
  type        = map(number)
  description = "Hours on which to run Lambda on Schedule"
  default     = {
    nonprod   = 19
    prod      = 23
  }
}

variable "api_spec_ver" {
  type        = string
  description = "The API Spec Version"
  default     = "0.0.1"
}

variable "environment" {
  type        = string
  description = "Environment Name (`feature` or workspace name)"
  default     = "feature"
}

variable "sftp_vars" {
  type        = map(string)
  description = "Map of values for SFTP"
  default     = {
    EVL_SFTP_CONFIG = "feature/sftp_poc/evl_config"
    EVL_SFTP_SEND   = "false"
    EVL_SFTP_PATH   = "evl"
    TFL_SFTP_CONFIG = "feature/sftp_poc/tfl_config"
    TFL_SFTP_SEND   = "false"
    TFL_SFTP_PATH   = "tfl"
  }
}

variable "app_config_ids" {
  type        = object({
    app_config_id  = string
    vtx_profile_id = string
    vtm_profile_id = string
    vta_profile_id = string
  })
  description = "Collection of App Config Identifiers"
}

variable "app_config_environment_id" {
  type        = string
  description = "The AppConfig Environment ID to use"
}

## Deployment Flags
variable "enable_firehose" {
  type        = bool
  description = "Should Firehose be enabled?"
  default     = false
}

variable "enable_cw_alarms" {
  type        = bool
  description = "Should we enable CloudWatch Alarms"
  default     = false
}

variable "force_destroy" {
  type        = bool
  description = "Should we ensure resources are destroyed?"
  default     = true
}

variable "create_develop_sftp_server" {
  type        = bool
  description = "Should we create a Develop SFTP Server?"
  default     = false
}

variable "include_option" {
  type    = bool
  default = true
}

variable "include_verb" {
  type    = bool
  default = true
}