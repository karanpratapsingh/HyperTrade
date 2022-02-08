locals {
  name = "trader"
}

resource "digitalocean_container_registry" "registry" {
  name                   = "${local.name}-registry"
  subscription_tier_slug = "professional"
}

resource "digitalocean_kubernetes_cluster" "cluster" {
  name    = "${local.name}-cluster"
  region  = "nyc1"
  version = "1.21.9-do.0"

  node_pool {
    name       = "${local.name}-node-pool"
    size       = "s-1vcpu-2gb"
    node_count = 2
  }
}

resource "digitalocean_container_registry_docker_credentials" "credentials" {
  registry_name = digitalocean_container_registry.registry.name
}

provider "kubernetes" {
  host  = digitalocean_kubernetes_cluster.cluster.endpoint
  token = digitalocean_kubernetes_cluster.cluster.kube_config.0.token
  cluster_ca_certificate = base64decode(
    digitalocean_kubernetes_cluster.cluster.kube_config.0.cluster_ca_certificate
  )
}

resource "kubernetes_secret" "secret" {
  metadata {
    name = "${local.name}-docker-config"
  }

  data = {
    ".dockerconfigjson" = digitalocean_container_registry_docker_credentials.credentials.docker_credentials
  }

  type = "kubernetes.io/dockerconfigjson"
}
