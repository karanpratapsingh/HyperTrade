terraform {
  required_providers {
    vultr = {
      source  = "vultr/vultr"
      version = "2.8.1"
    }
  }
}

provider "vultr" {
  api_key     = var.vultr_api_key
  rate_limit  = 700
  retry_limit = 3
}
