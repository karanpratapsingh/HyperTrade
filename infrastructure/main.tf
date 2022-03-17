locals {
  name = "hypertrade"
  docker_credentials = {
    "auths" = {
      "ghcr.io" = {
        "auth" = base64encode("${var.github_username}:${var.GHCR_TOKEN}")
      }
    }
  }
}

resource "digitalocean_container_registry" "registry" {
  name                   = "${local.name}-registry"
  subscription_tier_slug = "professional"
}

resource "digitalocean_kubernetes_cluster" "cluster" {
  name    = "${local.name}-cluster"
  region  = "nyc1"
  version = "1.22.7-do.0"

  node_pool {
    name       = "${local.name}-node-pool"
    size       = "s-1vcpu-2gb"
    node_count = 1
  }
}

provider "kubernetes" {
  host  = digitalocean_kubernetes_cluster.cluster.endpoint
  token = digitalocean_kubernetes_cluster.cluster.kube_config.0.token
  cluster_ca_certificate = base64decode(
    digitalocean_kubernetes_cluster.cluster.kube_config.0.cluster_ca_certificate
  )
}

resource "kubernetes_secret" "secret" {
  type = "kubernetes.io/dockerconfigjson"

  metadata {
    name = "${local.name}-docker-config"
  }

  data = {
    ".dockerconfigjson" = jsonencode(local.docker_credentials)
  }
}
