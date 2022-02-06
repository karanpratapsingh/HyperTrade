### Installation

- Install [terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli), [kubectl](https://kubernetes.io/docs/tasks/tools/) [helm](https://helm.sh/docs/intro/install/) CLI

- Create Kubernetes cluster and installs [Argo CD](https://argo-cd.readthedocs.io/en/stable/getting_started/)

_Note: You'll need to `export export DIGITALOCEAN_TOKEN==value-of-your-token`_

```
$ cd infrastructure
$ terraform init
$ terraform apply
$ cd ..
```

This should create a `infrastructure/k8s/kubeconfig.yaml` file that we can use with `kubectl` and `helm`

```
$ export KUBECONFIG=./infrastructure/k8s/kubeconfig.yaml
```

**Running the App**

- Install the following
  -  [yq](https://github.com/mikefarah/yq)
  -  [minikube](https://minikube.sigs.k8s.io/docs/start/)
  -  [skaffold](https://skaffold.dev/docs/install/)
  -  [helm](https://helm.sh/docs/intro/install/)
  -  [go 1.17](https://go.dev/doc/install)
  -  [node 16](https://nodejs.org/en/download/)
  -  [python 3.8](https://www.python.org/downloads/)

- Check the `infrastructure/k8s/app/env.example.yaml` and add your secrets then save it as `infrastructure/k8s/app/env.yaml`
- `make prepare` (prepare local environment)
- `make dev` (for development)
- `make run` (preview production mode)
- `make deploy` (deploy to production cluster)
- `make stop` (stop local minikube cluster)
