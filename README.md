### Installation

- Install [terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli), [kubectl](https://kubernetes.io/docs/tasks/tools/) [helm](https://helm.sh/docs/intro/install/) CLI

- Create Kubernetes cluster and installs [Argo CD](https://argo-cd.readthedocs.io/en/stable/getting_started/)

_Note: You'll need to `export VULTR_API_KEY=value-from-console`_

```
$ cd infrastructure
$ terraform init
$ terraform apply -var vultr_api_key=$VULTR_API_KEY
$ cd ..
```

_Note: If fails with `Error: Post "http://localhost/api/v1/namespaces"` just re-apply._

This should create a `infrastructure/k8s/kubeconfig.yaml` file that we can use with `kubectl` and `helm`

```
$ chmod 600 ./infrastructure/k8s/kubeconfig.yaml
$ export KUBECONFIG=./infrastructure/k8s/kubeconfig.yaml
```

- Get default Argo CD password

```
$ kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

- Connect to argo using `make connect-argo` then going over to `localhost:8080`

- Use the default password and change it. **important**

- Delete the default password secret.

```
$ kubectl -n argocd delete secret argocd-initial-admin-secret
```

- Create a [github token](https://github.com/settings/tokens) and export it.

```
$ export ARGO_GITHUB_TOKEN=your_github_token
```

- Apply with Helm.

```
$ helm install k8s/argo --set repository.token=$ARGO_GITHUB_TOKEN --generate-name
```

- Now Argo CD should deploy your manifests in `infrastructure/k8s/app` automatically.
