# Creating Kontena Nodes on Vagrant

> The following instructions are designed for those who want to create Kontena Nodes using the Kontena CLI built-in provision tool. It is also possible to create Kontena Nodes manually.

* [Prerequisites](#prerequisites)
* [Create Kontena Node](#install-kontena-node)
* [SSH to Kontena Node](#ssh-to-kontena-node)
* [Start Kontena Node](#start-kontena-node)
* [Stop Kontena Node](#stop-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)

## Prerequisites

* [Kontena CLI](/tools/cli.md) with the `vagrant` plugin. If you don't have the plugin installed, you can install it with the: `kontena plugin install vagrant` command.
* Vagrant 1.6 or later. Visit [https://www.vagrantup.com/](https://www.vagrantup.com/) to get started.

## Create Kontena Node

```
$ kontena vagrant node create
```

## SSH to Kontena Node

```
$ kontena vagrant node ssh <NAME>
```

## Start Kontena Node

```
$ kontena vagrant node start <NAME>
```

## Stop Kontena Node

```
$ kontena vagrant node stop <NAME>
```

## Restart Kontena Node

```
$ kontena vagrant node restart <NAME>
```

## Terminate Kontena Node

```
$ kontena vagrant node terminate <NAME>
```

## Update Kontena Node

By default, Kontena Nodes will auto-update to the same version as Kontena Master immediately if thr `major` or `minor` version changes (`major.minor.x`). Kontena Nodes will do a patch level auto-update only when rebooted or systemd is restarted. This auto-update process can be forced by executing the following command in every Kontena Node host:

```
$ sudo systemctl restart kontena-agent
```

## Advanced Usage

```
Usage:
    kontena vagrant node create [OPTIONS] [NAME]

Parameters:
    [NAME]                        Node name

Options:
    --grid GRID                   Specify grid to use
    --instances AMOUNT            How many nodes will be created (default: "1")
    --memory MEMORY               How much memory node has (default: "1024")
    --version VERSION             Define installed Kontena version (default: "latest")
```
