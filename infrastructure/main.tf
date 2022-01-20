locals {
  label            = "tf"
  kube_config_file = "${path.module}/../k8s/kubeconfig.yaml"
  namespace        = "argocd"
}

resource "vultr_kubernetes" "cluster" {
  label   = local.label
  region  = "lax"
  version = "v1.21.7+2"

  node_pools {
    node_quantity = 1
    plan          = "vc2-1c-2gb"
    label         = "${local.label}-node"
  }
}

resource "local_file" "kubeconfig" {
  content  = base64decode(vultr_kubernetes.cluster.kube_config)
  filename = local.kube_config_file
}

provider "kubernetes" {
  config_path = local.kube_config_file
}

resource "kubernetes_namespace" "argo_namespace" {
  depends_on = [local_file.kubeconfig]
  metadata {
    name = local.namespace
  }
}

resource "null_resource" "argo_install" {
  depends_on = [kubernetes_namespace.argo_namespace]
  provisioner "local-exec" {
    command = "KUBECONFIG=${local.kube_config_file} kubectl apply -n ${local.namespace} -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml"
  }
}
