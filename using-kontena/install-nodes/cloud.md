# Creating Kontena Cloud Nodes

* [Prerequisites](#prerequisites)
* [Create Kontena Node](#install-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)
* [Pricing](#pricing)

## Prerequisites

* [Kontena CLI](/tools/cli.md) with the latest version of `cloud` plugin. If you don't have the plugin installed, you can install it with the: `kontena plugin install cloud` command.
* [Kontena Cloud Platform](/using-kontena/platform.md). Kontena Cloud Nodes can be only attached to a Kontena Cloud Platform.

## Create one or more Kontena Nodes

```
$ kontena cloud node create
```

## List Kontena Nodes

List nodes in current organization:

```
$ kontena cloud node ls
```

List nodes in specific organization:

```
$ kontena cloud node ls --org <ORG>
```

## Open shell to a Kontena Node

```
$ kontena cloud shell <NAME>
```

## Restart a Kontena Node

```
$ kontena cloud node reboot <NAME>
```

## Terminate a Kontena Node

```
$ kontena cloud node terminate <NAME>
```

## Update a Kontena Node


### Kontena Agent

By default, Kontena Nodes will auto-update to the same version as the Kontena Platform Master immediately if the `major` or `minor` version changes (`major.minor.x`). Kontena Nodes will do a patch level auto-update only when rebooted or systemd is restarted. This auto-update process can be forced by executing the following command in every Kontena Node host:

```
$ kontena cloud node shell <NAME> systemctl restart kontena-agent
```

### Host Operating System

Kontena Nodes use [Container Linux](https://coreos.com/os/docs/latest/) as the host operating system. Host OS is configured to download updates automatically but they are applied only when a Kontena Node is rebooted. To apply updates, reboot a node with the following command:

```
$ kontena cloud node reboot <NAME>
```

## Advanced Usage

### Create

```
Usage:
    kontena cloud node create [OPTIONS]

Options:
    --platform PLATFORM           Specify Kontena Cloud platform to use
    --count COUNT                 How many nodes to create
    --type TYPE                   Node type
    --region REGION               Region (us-east-1, eu-west-1, defaults to current platform region)
    --label, -l LABEL             Node labels
    --ssh-key SSH_KEY             Path to ssh public key
```

### List

```
Usage:
    kontena cloud node ls [OPTIONS]

Options:
    --organization, --org ORG     Organization (default: $KONTENA_ORGANIZATION)
    --quiet, -q                   Output the identifying column only
```

### Shell

```
Usage:
    kontena cloud node shell [OPTIONS] NAME [CMD] ...

Parameters:
    NAME                          Node name
    [CMD] ...                     Command

Options:
    --platform PLATFORM           Specify Kontena Cloud platform to use
```

### Terminate

```
Usage:
    kontena cloud node terminate [OPTIONS] [NAME]

Parameters:
    [NAME]                        Node name

Options:
    --platform PLATFORM           Specify Kontena Cloud platform to use
    --force                       Force remove (default: false)
```

## Pricing

For more information, see [Kontena Cloud Compute Pricing](https://www.kontena.io/pricing)