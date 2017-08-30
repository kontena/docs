# Using Kontena Services

[Kontena Services](./README.md#kontena-services) are describing container workloads that are part of Kontena Stack. They abstract a logical set of containers, their configuration, and their desired state.

In this chapter, we'll discover how to manage, operate and monitor Kontena Services with Kontena CLI tool:

* [List Services](#list-services)
* [Create a New Service](#create-a-new-service)
* [Deploy Service](#deploy-service)
* [Update Service](#update-service)
* [Scale Service](#scale-service)
* [Stop Service](#stop-service)
* [Start Service](#start-service)
* [Restart Service](#restart-service)
* [Exec](#exec)
* [Show Details](#show-service-details)
* [Show Logs](#show-service-logs)
* [Show Event Logs](#show-service-event-logs)
* [Show Statistics](#show-service-statistics)
* [Monitor Service Instances](#monitor-service-instances)
* [Show Environment Variables](#show-service-environment-variables)
* [Add Environment Variable](#add-environment-variable-to-service)
* [Remove Environment Variable](#remove-environment-variable-from-service)
* [Add Secret](#add-secret-to-service)
* [Remove Secret](#remove-secret-from-service)
* [Link Service](#link-service)
* [Unlink Service](#unlink-service)
* [Remove Service](#remove-service)

### List Services

```
$ kontena service ls
```

**Options:**

```
--grid GRID                   Specify Grid to use
```


### Create a New Service

```
$ kontena service create <name> <image>
```

**Examples:**

```
# A Stateless Service that exposes port 80
$ kontena service create -p 80:80 nginx nginx:latest

# A Stateful Service that does not expose any ports, but can be accessed from other Services within the same grid
$ kontena service create --stateful redis redis:latest
```

**Note:** The`kontena service create` command does not automatically deploy a service.
That must be done separately with `kontena service deploy`.

**Options:**

```
--grid GRID                   Specify the Grid to use
-p, --ports PORTS             Publish a service's port to the host
-e, --env ENV                 Set the environment variables
-l, --link LINK               Add a link to another service in the form of name:alias
-v, --volume VOLUME           Add a volume or bind mount it from the host
--volumes-from VOLUMES_FROM   Mount volumes from another container
-a, --affinity AFFINITY       Set the service affinity
-c, --cpu-shares CPU_SHARES   CPU shares (relative weight)
-m, --memory MEMORY           Memory limit (format: <number><optional unit>, where a unit = b, k, m or g)
--memory-swap MEMORY_SWAP     Total memory usage (memory + swap), set '-1' to disable swap (format: <number><optional unit>, where unit = b, k, m or g)
--cmd CMD                     Command to execute
--instances INSTANCES         How many instances should be deployed
-u, --user USER               Username which executes the first process inside a container
--stateful                    Set a service as stateful (default: false)
--privileged                  Give extended privileges to this service (default: false)
--cap-add CAP_ADD             Add capabitilies
--cap-drop CAP_DROP           Drop capabitilies
--net NET                     Network mode
--log-driver LOG_DRIVER       Set the logging driver
--log-opt LOG_OPT             Add logging options
--deploy-strategy STRATEGY    Deploy strategy to use (ha, random)
--deploy-wait-for-port PORT   Wait for a port to respond when deploying
--deploy-min-health FLOAT     The minimum percentage (0.0 - 1.0) of healthy instances that do not sacrifice overall service availability while deploying
--pid PID                     Pid namespace to use
--secret SECRET               Import a secret from Vault
```

### Deploy Service

```
$ kontena service deploy <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
--force-deploy                Force deploy even if a service does not have any changes
```

### Update Service

```
$ kontena service update <name>
```

**Note:** The `kontena service update` command does not automatically redeploy a stateful service.
It must be done separately with `kontena service deploy`.

**Options:**

```
--grid GRID                   Specify a Grid to use
--image IMAGE                 Docker image to use
-p, --ports PORT              Publish a service's port to the host
-e, --env ENV                 Set the environment variables
-l, --link LINK               Add a link to another service in the form of name:alias
-a, --affinity AFFINITY       Set the service affinity
-c, --cpu-shares CPU_SHARES   CPU shares (relative weight)
-m, --memory MEMORY           Memory limit (format: <number><optional unit>, where unit = b, k, m or g)
--memory-swap MEMORY_SWAP     Total memory usage (memory + swap), set '-1' to disable swap (format: <number><optional unit>, where unit = b, k, m or g)
--cmd CMD                     Command to execute
--instances INSTANCES         How many instances should be deployed
-u, --user USER               Username which executes the first process inside a container
--privileged                  Give extended privileges to this service (default: false)
--cap-add CAP_ADD             Add capabitilies
--cap-drop CAP_DROP           Drop capabitilies
--net NET                     Network mode
--log-driver LOG_DRIVER       Set the logging driver
--log-opt LOG_OPT             Add logging options
--deploy-strategy STRATEGY    Deploy strategy to use (ha, random)
--deploy-wait-for-port PORT   Wait for a port to respond when deploying
--deploy-min-health FLOAT     The minimum percentage (0.0 - 1.0) of healthy instances that do not sacrifice overall service availability while deploying
--pid PID                     Pid namespace to use
--secret SECRET               Import a secret from Vault
```

### Scale Service

```
$ kontena service scale <name> <number>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Stop Service

```
$ kontena service stop <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Start Service

```
$ kontena service start <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Restart Service

```
$ kontena service restart <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Show Service Details

```
$ kontena service show <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Show Service Logs

```
$ kontena service logs <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
-t, --tail                    Tail (follow) logs (default: false)
--lines LINES                 Number of lines to show from the end of the logs (default: 100)
--since SINCE                 Show logs since given timestamp
-i, --instance INSTANCE       Show only given instance specific logs
```

### Show Service Event Logs

```
$ kontena service events <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
-t, --tail                    Tail (follow) logs (default: false)
--lines LINES                 Number of lines to show from the end of the logs (default: 100)
--since SINCE                 Show logs since given timestamp
```

### Show Service Statistics

```
$ kontena service stats <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
-t, --tail                    Tail (follow) stats in real time (default: false)
```

### Monitor Service Instances

```
$ kontena service monitor <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
--interval SECONDS            How often view is refreshed (default: 2)
```

### Show Service Environment Variables

```
$ kontena service env list <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Add Environment Variable to Service

```
$ kontena service env add <name> <env>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Remove Environment Variable from Service

```
$ kontena service env remove <name> <env>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Link Secret to Service

```
$ kontena service secret link <name> <secret>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Unlink Secret from Service

```
$ kontena service secret unlink <name> <secret>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Link Service

```
$ kontena service link <name> <target>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Unlink Service

```
$ kontena service unlink <name> <target>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Remove Service

```
$ kontena service remove <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
```

### Exec

Run a command in a running service instance(s).

```
$ kontena service exec <name>
```

**Options:**

```
--grid GRID                   Specify a Grid to use
--instance INSTANCE           Exec on given numbered instance, default first running
-a, --all                     Exec on all running instances
--shell                       Execute as a shell command
-i, --interactive             Keep stdin open
-t, --tty                     Allocate a pseudo-TTY
--skip                        Skip failed instances when executing --all
--silent                      Do not show exec status
--verbose                     Show exec status
```
