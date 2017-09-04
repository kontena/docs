# Kontena Stack File

[Kontena Stacks](./README.md#kontena-stacks) are defined via Kontena Stack Files. A Kontena Stack File is a file in [YAML](http://yaml.org) format that describes a collection of [Kontena Services](./services.md) and their [configuration](#services). Kontena Services are described like [docker compose](https://docs.docker.com/compose/compose-file/), but with [some exceptions](../references/stack-file-vs-compose.md). You can create Kontena Stack Files using your favorite text editor. The default name for this file is `kontena.yml`, although other file names could be used.

Kontena Stack Files are primarily used for describing [Kontena Services](#services). In addition, you can use advanced features such as [exposing](#expose), infrastructure agnostic [volumes](#volumes), [dynamic variables](#variables) and built-in [template language](#template-language). Therefore, it is possible (and we highly recommend) to create re-usable, generic implementations. For example, it is possible to create a single Kontena Stack File for a common service or an entire solution that will work for all your projects. Even better, it will work for all Kontena users without any modifications! Kontena Stack Files may be shared and distributed as traditional files or via the [Kontena Stack Registry](../tools/stack-registry.md).

Learn more:

* [Kontena Stack File Reference](#kontena-stack-file-reference)
  * [stack](#stack) - Specify the Kontena Stack name.
  * [version](#version) - Specify the Kontena Stack version.
  * [description](#description) - Specify the description.
  * [variables](#variables) - Define the variables.
  * [expose](#expose) - Expose this Kontena Stack via a selected Kontena Service.
  * [services](#services) - Configuration of all Kontena Services.
  * [volumes](#volumes) - Kontena Volumes configuration.
* [Template Language](#template-language)
* [Examples](#examples)
* [Hints, Tips and Best Practises](#hints-tips-and-best-practises)

## Kontena Stack File Reference

The complete Kontena Stack File may look something like this:

```yaml
stack: kontena/example-app
version: 0.1.0
description: This is an example app
variables:
  mysql_root_pw:
    type: string
    from:
      vault: EXAMPLE_MYSQL_ROOT_PASSWORD
      prompt: Enter a root password for MySQL or leave empty to auto generate
      random_string: 16
    to:
      vault: EXAMPLE_MYSQL_ROOT_PASSWORD
  app_domain:
    type: string
    default: www.my-app.com
    from:
      prompt: App domain
expose: loadbalancer
services:
  loadbalancer:
    image: kontena/lb:latest
    ports:
      - 80:80
  app:
    build: .
    image: registry.kontena.local/example-app:latest
    instances: 2
    links:
      - loadbalancer
    environment:
      - DB_URL=db
      - KONTENA_LB_INTERNAL_PORT=8080
      - KONTENA_LB_VIRTUAL_HOSTS={{ app_domain }}
    deploy:
      strategy: ha
      wait_for_port: 8080
    hooks:
      post_start:
        - name: sleep
          cmd: sleep 10
          instances: *
  db:
    image: mysql:5.6
    stateful: true
    secrets:
      - secret: EXAMPLE_MYSQL_ROOT_PASSWORD
        name: MYSQL_ROOT_PASSWORD
        type: env
    volumes:
      - mysql-data:/var/lib/mysql
volumes:
  mysql-data:
    external:
      name: example-mysql-data
```

In this section, we will list all supported configuration options for Kontena Stack Files.

### `stack`

Specify the Kontena Stack name. Use the format `<USER_NAME>/<STACK_NAME>`. For example:

```yaml
stack: john/mystack
```

### `version`

Specify the Kontena Stack version number based on [Semantic Versioning](http://semver.org/). For example:

```yaml
version: 1.0.0
```

### `description`

Specify the Kontena Stack description (**optional**). For example:

```yaml
description: This is my awesome Kontena Stack!
```

### `expose`

Kontena Stacks may be exposed to other Kontena Stacks via a specified Kontena Service. The exposed Kontena Service may be accessed by other Kontena Stacks and Services using the Kontena Stack [service discovery](../service-discovery.md#stack-address) address. See [usage examples](#exposing-kontena-stack).

Please note, it is not possible to expose multiple Kontena Services directly. If you need to expose multiple Kontena Services, you can expose a [Kontena Load Balancer](./loadbalancer.md) that is linked to all Kontena Services you want to expose.

### `variables`

Describe and configure dynamic variables that may be used to fill in values and to create conditional logic in the Kontena Stack File. All variables, including environment variables you might want to use, must be declared here. [Learn more](/references/stack-file-variables.md).

### `services`

Describe and configure one or more [Kontena Services](./services.md) belonging to this Kontena Stack. For example, this is how you can define Kontena Services named `web` and `db`:

```yaml
services:
  web:
    image: myapp:latest
  db:
    image: postgres:latest
    stateful: true
```

There are many configuration options available for defining Kontena Services. In this section, we will list all supported configuration options for Kontena Services.

* **`image`** - The image used to deploy this Kontena Service in docker format. (**required**).
* **`instances`** - Specify the number of instances (replicas) to run for the Kontena Service. Default: `1`.
* **`stateful`** - Mark a service as stateful. Options: `true` or `false`. Default: `false`. If enabled, the Kontena Platform will automatically create and mount a data volume container for this Kontena Service. This option binds each Kontena Service instance to the Kontena Node that is first scheduled on to, so that the same volumes can be mapped whenever the Kontena Service is updated. In addition, the Kontena Platform scheduler will stop attempting to re-schedule this Kontena Service after the initial deployment is done.
* **`secrets`** - Expose the list of secrets from [Kontena Vault](./vault.md) to this Kontena Service. See usage [example](#using-secrets). Each list item must specify the `secret`, `name` and `type` parameters:
  * **`secret`** - Specify the name of a secret in Kontena Vault.
  * **`name`** - Specify the name exposed to this Kontena Service.
  * **`type`** - Specify how the secret will be exposed. Must be `env` since your Kontena Platform does not support any other way to expose secrets at the moment.
* **`deploy`** - Specify how Kontena will schedule Kontena Service Instances across your Kontena Platform. The deployment options are described as a list of parameters. See usage [example](#using-deploy-options).
  * **`strategy`** - How to deploy multiple instances of this service to more than one Kontena Node. Supported values: `ha`, `daemon` and `random`.
    * With `ha` deploy strategy, Kontena Service Instances are spread evenly across availability zones and Kontena Nodes. The Kontena Platform scheduler will try to spread the Kontena Service Instances evenly across availability zones and Kontena Nodes. Availability zones are resolved from Kontena Node labels; for example, `az=a1` means that that Node belongs to availability zone `a1`.
    * With the `daemon` deploy strategy, Kontena Service Instances are deployed to all Kontena Nodes. If used together with the service `instances` configuration option, a given number of instances will be deployed to all Kontena Nodes.
    * With the `random` deploy strategy, Kontena Service Instances are deployed randomly across your Kontena Platform.
  * **`wait_for_port`** - Wait until the specified port is responding before deploying another instance. This makes it possible to achieve zero-downtime deploys. The value must be in milli-seconds. For example, the value `3000` (=3s).
  * **`min_health`** - The minimum percentage (expressed as a number in the range 0.0 - 1.0) of healthy Kontena Service Instances that do not sacrifice overall Kontena Service availability while deploying.
  * **`interval`** - The interval of automatic redeployment of the service. This can be used as an "erosion-resistance" mechanism. Format <number><unit>, where unit = min, h, d. For example, value `7d`.
* **`affinity`** - Specify affinity rules that will be used by Kontena Platform scheduler when scheduling this Kontena Service. Affinity rules may be positive (`==`) or negative (`!=`) and they may be compared against Kontena Node name, Kontena Service name, containers or labels. See usage [example](#using-affinity-rules).
* **`hooks`** - Specify a list of commands that are executed at various stages of this Kontena Service lifecycle. The currently supported stages are `post_start` and `pre_build`. See usage [example](#using-hooks).
  * **`post_start`** - Specify a list of commands that are executed after each Kontena Service Instance is started. The commands are executed in the same order as defined. Please note, these commands are executed before the `wait_for_port` check. Each post_start hook must specify the `name`, `cmd`, `instance` and `oneshot` parameters (see example below):
    * **`name`** - A unique name for this hook.
    * **`cmd`** - The command to be executed.
    * **`instance`** - A comma separated list of Kontena Service Instances (numbers) where this hook is executed (`*` for all).
    * **`oneshot`** - Should this hook be executed only once in a Kontena Service lifetime (default: `false`)
  * **`pre_build`** - Specify a list of commands that are executed before the actual Docker image is built. The commands are executed in the same order as defined. If any of the commands fail the build is aborted. Each pre_build hook must specify the `name` and `cmd` parameters (see example below):
    * **`name`** - A unique name for this hook.
    * **`cmd`** - The command to be executed.
* **`build`** - Specify the configuration options that are applied at docker image build time. [Learn more](https://docs.docker.com/compose/compose-file/compose-file-v2/#build). **NOTE!** The `network` and `label` options mentioned in docker compose documentation do not work with Kontena Stack Files.
* **`cap_add`** and **`cap_drop`** - Add or drop container capabilities. [Learn more](https://docs.docker.com/compose/compose-file/compose-file-v2/#cap_add-cap_drop).
* **`command`** - Recall the optional COMMAND. [Learn more](https://docs.docker.com/compose/compose-file/compose-file-v2/#command).
* **`cpus`** - Specify how much of the available CPU resources a Kontena Service Instance can use. For example, if the host machine has two CPUs and you set `cpus: 1.5`, the Kontena Service Instance will be guaranteed to be able to access at most one and a half of the CPUs. Kontena Platform will automatically target deployment to nodes that have at least number of specified CPUs available.
* **`cpu_shares`** - By default, all containers get the same proportion of CPU cycles. This proportion can be modified by changing the container’s CPU share weighting relative to the weighting of all other running containers. [Learn more](https://docs.docker.com/engine/reference/run/#cpu-share-constraints).
* **`mem_limit`** and **`memswap_limit`** - Specify memory limits for containers. [Learn more](https://docs.docker.com/reference/run/#runtime-constraints-on-resources).
* **`depends_on`** - Declare dependency between Kontena Services in this stack. Your Kontena Platform will create and deploy Kontena Services in dependency order. See [example](#using-depends-on-to-declare-dependencies).
* **`environment`** - A list of environment variables to be added in the service containers on launch. You can specify a list or a dictionary. **NOTE!** Your Kontena Platform will automatically add the following environment variables to all running Kontena Service Instances: KONTENA_SERVICE_ID, KONTENA_SERVICE_NAME, KONTENA_GRID_NAME, KONTENA_PLATFORM_NAME, KONTENA_NODE_NAME. See [example](#different-ways-to-set-environment-variables).
* **`env_file`** - A reference to a file that contains environment variables. For example: `env_file: production.env`
* **`stop_grace_period`** - Specify how long to wait when attempting to stop a container if it doesn’t handle SIGTERM (or whatever stop signal has been specified with stop_signal), before sending SIGKILL. Specified as a duration. Some examples: `1s`, `1m30s`, `1m12.3s` or `1h1m12.3s`
* **`extends`** - Extend another service, in the current file, another file or a stack in the stacks registry, optionally overriding any configuration. You can, for example, extend `docker-compose.yml` services and introduce only Kontena-specific fields in `kontena.yml`. See [example](#using-extends-to-extend-docker-compose-file-with-kontena).
* **`links`** - Specify to another Kontena Service. Either specify both the service name and the link alias `<SERVICE>:<ALIAS>`, or just the service name (which will also be used for the alias). The link can also point to a Kontena Service from another stack. The notation is then `<STACK>/<SERVICE>:<ALIAS>`. Please note, the Kontena Platform's built-in service discovery will ensure you can always reach services using the DNS address. Links are not needed for the service discovery. Links also express dependency between services in the same way as `depends_on`, so they determine the order of service startup. See [example](#linking-kontena-services).
* **`network_mode`** - Specify the network mode. E.g. `network_mode: "bridge"` or `network_mode: "host"`.
* **`pid`** - Sets the PID mode to the host PID mode. E.g. `pid: host`.
* **`ports`** - Specify how to map ports between the host machine and a container. You can describe any number of these mappings using the `<HOST>:<CONTAINER>` format. For example: `80:80`, `53160:53160/udp` and `1.2.3.4:8443:443`. Please note, if you use bind IP in the port exposure definition, be sure to use proper affinity rules to bind the service to a Node where this address is available.
* **`privileged`** - Give extended privileges to service. E.g. `privileged: true`.
* **`user`** - The default user to run the first process. E.g. `user: app_user`.
* **`volumes`** - Specify a list of named volumes, anonymous data volumes or bind mounted host directories that will be mounted to Kontena Service Instances. These mounts are exposed via the specified path with optional access mode configuration using the syntax `<NAMED_VOLUME_NAME OR HOST_PATH>:<CONTAINER_PATH>:<ACCESS_MODE>`. By default, the access mode is `rw` (read+write). Set the access mode to `ro` for read only.
  * **Named volumes** are defined via [Kontena Volumes](./volumes.md). Once declared, you can mount them here. For example, if you have created Kontena Volume `mysql-data`, you can expose it to your container directory `/var/lib/mysql` like this: `mysql-data:/var/lib/mysql`.
  * **Anonymous data volumes** are created on the fly. The volume is only persistent if the service is marked as `stateful: true`. For example, you can create an anonymous data volume mounted by the path `/var/lib/mysql` just by adding the path here without any other options, like this: `/var/lib/mysql`.
  * **Bind mount host directory as volume** will expose a path from your host to a specified path in your container. For example, if you want to mount `/data/mysql` from your host to path `/var/lib/mysql` in your container, you can do it like this: `/data/mysql:/var/lib/mysql`
* **`volumes_from`** - Mount all the volumes from one or more Kontena Service(s) that are part of this same Kontena Stack. Lists the Kontena Service names. See [example](#using-volumes-from).
* **`logging`** - Specify [docker logging driver configuration](https://docs.docker.com/compose/compose-file/compose-file-v2/#logging) that will replace [the Kontena Platform built-in logging features](./logs.md). **NOTE!** Once you set the docker logging driver configuration here, you can not see log entries origination from this Kontena Service on the Kontena Platform logging interface anymore.
* **`health_check`** - Specify health checks for this service. Provide health check configuration information as described below. See [example](#using-health-check).
  * **`protocol`** - protocol to use, either `http` or `tcp`. When performing tcp mode check, your Kontena Platform will only try to open a tcp socket connection to the specified port. If the connection is successful the Kontena Service Instance is considered healthy.
  * **`port`** - port to use for the check. This is the port the application is using within the Kontena Service Instance.
  * **`interval`** - how often the health check is performed. Defined in seconds.
  * **`uri`** - The relative URI to use for the health check. Only used in http mode.
  * **`initial_delay`** - The time to wait until the first check is performed. Allows some time for the application to boot up.
  * **`timeout`** - How long your Kontena Platform will wait for a response. If no response is received within this timeframe the Kontena Service Instance is considered unhealthy.

### `volumes`

Declare infrastructure agnostic Kontena Volumes that may be used as **named volumes** for any of the Kontena Services belonging to this Kontena Stack. See [usage example](#using-kontena-volumes).

## Template Language

For more advanced usage, the Kontena Stack Files support [Liquid](https://shopify.github.io/liquid/) template language. The variables are also available inside the template tags.

```yaml
variables:
  target:
    type: enum
    options:
      - production
      - staging

services:
  app:
  image: app:latest
  environment:
    # {% if target == "staging" %}
    - "DEBUG=true"
    # {% endif %}
```

Notice that the file has to be a valid YAML before and after template rendering.

## Examples

#### Exposing Kontena Stack

Expose Kontena Stack via a single service like this:

```yaml
expose: redis
services:
  redis:
    image: redis:3
```

Expose multiple Kontena Services via Kontena Load Balancer like this:

```yaml
expose: lb
services:
  lb:
    image: kontena/lb:latest
  elasticsearch:
    image: elasticsearch:5
    environment:
      - KONTENA_LB_MODE=tcp
      - KONTENA_LB_EXTERNAL_PORT=9200
      - KONTENA_LB_INTERNAL_PORT=9200
    links:
      - lb
  logstash:
    image: logstash:alpine
    environment:
      - KONTENA_LB_MODE=tcp
      - KONTENA_LB_EXTERNAL_PORT=10514
      - KONTENA_LB_INTERNAL_PORT=10514
    links:
        - lb
```

#### Using `extends` to extend Docker Compose File with Kontena

**docker-compose.yml**

```yaml
app:
  build: .
  links:
    - db:db
db:
  image: mysql:5.6
```

**kontena.yml**

```yaml
app:
  extends:
    file: docker-compose.yml
    service: app
  image: registry.kontena.local/app:latest
db:
  extends:
    file: docker-compose.yml
    service: app
  image: mysql:5.6
redis:
  extends:
    stack: user/redis:1.0.0
    service: redis
```

#### Different Ways to Set Environment Variables

**As a list:**

```yaml
environment:
  - BACKEND_PORT=3306
  - FRONTEND_PORT=3306
  - MODE=tcp
```

**As a dictionary:**

```yaml
environment:
  BACKEND_PORT: 3306
  FRONTEND_PORT: 3306
  MODE: tcp
```

#### Linking Kontena Services

**Within a stack:**
```yaml
links:
  - mysql
```

**Across stacks:**
```yaml
links:
  - another-stack/loadbalancer
```

#### Using `depends_on` to declare dependencies

```yaml
web:
  image: myapp:latest
  depends_on:
    - db
    - redis
redis:
  image: redis:latest
db:
  image: postgres:latest
```

#### Using `deploy` options

```yaml
deploy:
  strategy: "ha"
  wait_for_port: 3000
```

#### Using `affinity` rules

```yaml
affinity:
  - node==node1.kontena.io
```

#### Using `hooks`

**Post Start Hooks:**

```yaml
hooks:
  post_start:
    - name: sleep
      cmd: sleep 10
      instances: *
      oneshot: true
```

**Pre Build Hooks:**

```yaml
hooks:
  pre_build:
    - name: npm install
      cmd: npm install
    - name: grunt
      cmd: grunt dist
```

#### Using `health_check`

```yaml
services:
  web:
    image: nginx
    stateful: false
    health_check:
      protocol: http
      port: 80
      interval: 20
      uri: /health
      initial_delay: 10
      timeout: 2

  mysql:
    image: mysql
    stateful: true
    deploy:
      strategy: ha
      wait_for_port: 3306
    environment:
      - MYSQL_ALLOW_EMPTY_PASSWORD=true
    health_check:
      protocol: tcp
      port: 3306
      interval: 10
      initial_delay: 10
      timeout: 2
```

#### Using `secrets`

In the example below, the Kontena Platform will expose the secret `MYSQL_ADMIN_PASSWORD` from Kontena Vault as an environment variable `MYSQL_PASSWORD` to the Kontena Service.

```yaml
services:
  myapi:
    image: example/myapi:latest
    environment:
      - MYSQL_USER=admin
      - MYSQL_HOST=mysql.kontena.local
    secrets:
      - secret: MYSQL_ADMIN_PASSWORD
        name: MYSQL_PASSWORD
        type: env
```

#### Using Kontena Volumes

In the example below, the Kontena Volume `database` has been created using the Kontena CLI `kontena volume create` command. It is exposed to Kontena Services as the named volume `redis-data`. The volume is mounted in path `/data` for the Kontena Service `redis`:

```yaml
stack: redis
description: Just a simple Redis stack using Kontena Volumes
version: 0.0.1
services:
  redis:
    image: redis:3.2-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
volumes:
  redis-data:
    external:
      name: database
```

Another option is to introduce the volume with `external: true`:

```
volumes:
  redis-data:
    external: true
```

In this case the Kontena Platform expects to find a volume called `redis-data` before the Kontena Stack can be installed or upgraded.

#### Using `volumes_from`

```
volumes_from:
 - wordpress-%s
```

The `-%s` will be replaced with the Kontena Service Instance number; for example, the first Kontena Service Instance will get volumes from wordpress-1, the second from wordpress-2, etc. `volumes_from` can only point to another service within a stack.
