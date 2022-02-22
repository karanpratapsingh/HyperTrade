## Trader (yet to be named properly!)

**USE THIS SOFTWARE AT YOUR OWN RISK. THE AUTHORS AND ALL AFFILIATES ASSUME NO LIABILITY FOR YOUR TRADING OUTCOMES.**

### Development

**Tools**

-  [Minikube](https://minikube.sigs.k8s.io/docs/start/)
-  [Skaffold](https://skaffold.dev/docs/install/)
-  [Helm](https://helm.sh/docs/intro/install/)
-  [Go >= 1.17](https://go.dev/doc/install)
-  [Node >= 16](https://nodejs.org/en/download/)
-  [Python >= 3.8](https://www.python.org/downloads/)
-  [yq](https://github.com/mikefarah/yq)
-  [doctl](https://github.com/digitalocean/doctl)

**Steps**

- Once all the tools are installed, execute `make prepare` to prepare local environment.
- Create a `infrastructure/k8s/env.yaml` file and add your secrets as shown in `infrastructure/k8s/env.example.yaml`.
- Start development with `make dev` command.
- Use `make stop` to stop the local minikube cluster.

_Note: Make sure the `SYMBOL` you used in `env.yaml` is also configured in `services/exchange/seed.json`_

### Deployment

Deployments are done automatically via `deploy.yml` github actions on merge with `main` branch. It also supports manual deployment as well. But first we need to provision our infrastructure.

_Note: Infrastructure we're about to provision has it's own cost!_

**Tools**

- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)

**Steps**

- Get an API token from DigitalOcean [dashboard](https://cloud.digitalocean.com/account/api/tokens).

- Export it temporarily for terraform.

```
$ export DIGITALOCEAN_TOKEN=value-of-your-token
```

- Apply terraform configuration.

```
$ cd infrastructure
$ terraform init
$ terraform apply
```

- Go to Github and add `DIGITALOCEAN_TOKEN` to your repository secrets for github actions.
- Generate `base64` string of your secrets, and add it as `APP_SECRETS` to your repository secrets for github actions. 

```
$ cat infrastructure/k8s/env.yaml| base64
```

- Go to the actions tab and run `Build and Deploy` action.

_Note: If you want to change name of the project, make sure to update all the associated kubernetes manifest files, skaffold config etc._

### Connecting

Since this application deals with sensitive personal financial data, it is **not recommended** to expose it via ingress unless we have proper authorization in place. Hence, it is recommended to connect to it via port-forwarding on your local machine.

**Steps**

- Connect to the application via port-forwarding using `make connect` command.

_Note: Make sure `doctl` is authenticated, and we're using correct k8s cluster name._

- Open `localhost:8080` to see the web interface.

- Once done, use the `make disconnect` command to remove the kubectl context from your machine.

_Note: It is recommended to use the telegram bot over user interface on non-secure systems._
