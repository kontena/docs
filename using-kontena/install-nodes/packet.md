# Creating Kontena Nodes on Packet

> The following instructions are designed for those who want to create Kontena Nodes using the Kontena CLI built-in provision tool. It is also possible to create Kontena Nodes manually.

* [Prerequisites](#prerequisites)
* [Create Kontena Node](#install-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)

## Prerequisites

* [Kontena CLI](/tools/cli.md) with the `packet` plugin. If you don't have the plugin installed, you can install it with the: `kontena plugin install packet` command.
* A Packet Account. Visit [https://www.packet.net/promo/kontena/](https://www.packet.net/promo/kontena/) to get started
* A Packet API token and Project ID.

## Create Kontena Node

```
$ kontena packet node create
```

## Restart Kontena Node

```
$ kontena packet node restart <NAME>
```

## Terminate Kontena Node

```
$ kontena packet node terminate <NAME>
```

## Update Kontena Node

By default, Kontena Nodes will auto-update to the same version as Kontena Master immediately if the `major` or `minor` version changes (`major.minor.x`). Kontena Nodes will do a patch level auto-update only when rebooted or systemd is restarted. This auto-update process can be forced by executing the following command in every Kontena Node host:

```
$ sudo systemctl restart kontena-agent
```

## Advanced Usage

```
Usage:
    kontena packet node create [OPTIONS] [NAME]

Parameters:
    [NAME]                        Node name

Options:
    --grid GRID                   Specify grid to use
    --token TOKEN                 Packet API token
    --project PROJECT ID          Packet project id
    --type TYPE                   Server type (baremetal_0, baremetal_1, ..) (default: "baremetal_0")
    --facility FACILITY CODE      Facility (default: "ams1")
    --billing BILLING             Billing cycle (default: "hourly")
    --ssh-key PATH                Path to ssh public key (optional)
    --version VERSION             Define installed Kontena version (default: "latest")
```
