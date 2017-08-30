# Creating Kontena Nodes on Container Linux

CoreOS is currently recommending the use of proprietary [Container Linux Config](https://coreos.com/os/docs/latest/provisioning.html) format for provisioning Container Linux machines. Previously, they recommended the use of cloud-config that is a more generic format.

Since cloud-config is widely supported by most of the public cloud providers and it may be used to provision Container Linux machines, Kontena is using cloud-config for provisioning Container Linux machines. An example cloud-config that can be used as the basis for provisioning a Kontena Node may be generated via Kontena CLI.

* [Prerequisites](#prerequisites)
* [Create Kontena Node](#install-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)

## Prerequisites

* [Kontena CLI](/tools/cli.md) with the `cloud-config` plugin. If you don't have the plugin installed, you can install it with the: `kontena plugin install cloud-config` command.

## Create Kontena Node

```
$ kontena cloud-config node create
```

## Restart Kontena Node

Not supported via Kontena CLI tool.

## Terminate Kontena Node

Not supported via Kontena CLI tool.

## Update Kontena Node

By default, Kontena Nodes will auto-update to the same version as Kontena Master immediately if the `major` or `minor` version changes (`major.minor.x`). Kontena Nodes will do a patch level auto-update only when rebooted or systemd is restarted. This auto-update process can be forced by executing the following command in every Kontena Node host:

```
$ sudo systemctl restart kontena-agent
```

## Advanced Usage

```
Usage:
    kontena cloud-config node create [OPTIONS] [NAME]

Parameters:
    NAME                          Node name

Options:
    --dns DNS                     DNS server
    --grid GRID                   Specify grid to use
    --peer-interface IFACE        Peer (private) network interface (default: "eth1")
    --docker-bip BIP              Docker bridge ip (default: "172.17.43.1/16")
    --version VERSION             Agent version (default: "latest")
```
