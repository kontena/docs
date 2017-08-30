# Creating Kontena Nodes on UpCloud

> The following instructions are designed for those who want to create Kontena Nodes using the Kontena CLI built-in provision tool. It is also possible to create Kontena Nodes manually.

* [Prerequisites](#prerequisites)
* [Create Kontena Node](#install-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)

## Prerequisites

* [Kontena CLI](/tools/cli.md) with the `upcloud` plugin. If you don't have the plugin installed, you can install it with the: `kontena plugin install upcloud` command.
* An UpCloud Account. Visit [https://www.upcloud.com/kontena/](https://www.upcloud.com/kontena/) to get started.

## Create Kontena Node

```
$ kontena upcloud node create
```

## Restart Kontena Node

```
$ kontena upcloud node restart <NAME>
```

## Terminate Kontena Node

```
$ kontena upcloud node terminate <NAME>
```

## Update Kontena Node

By default, Kontena Nodes will auto-update to the same version as Kontena Master immediately if the `major` or `minor` version changes (`major.minor.x`). Kontena Nodes will do a patch level auto-update only when rebooted or systemd is restarted. This auto-update process can be forced by executing the following command in every Kontena Node host:

```
$ sudo systemctl restart kontena-agent
```

## Advanced Usage

```
Usage:
    kontena upcloud node create [OPTIONS] [NAME]

Parameters:
    [NAME]                        Node name

Options:
    --grid GRID                   Specify grid to use
    --username USER               Upcloud username
    --password PASS               Upcloud password
    --ssh-key SSH_KEY             Path to ssh public key
    --plan PLAN                   Server size (default: "1xCPU-1GB")
    --zone ZONE                   Zone (default: "fi-hel1")
    --version VERSION             Define installed Kontena version (default: "latest")

Note: The username for ssh access is "root"
```
