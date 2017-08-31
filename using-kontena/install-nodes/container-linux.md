# Creating Kontena Nodes on Container Linux

CoreOS is currently recommending the use of proprietary [Container Linux Config](https://coreos.com/os/docs/latest/provisioning.html) format for provisioning Container Linux machines. Previously, they recommended the use of cloud-config that is a more generic format.

Since cloud-config is widely supported by most of the public cloud providers and it may be used to provision Container Linux machines, Kontena is using cloud-config for provisioning Container Linux machines. An example cloud-config that can be used as the basis for provisioning a Kontena Node may be generated via Kontena CLI.

* [Create Kontena Node](#create-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)

## Create Kontena Node

Following command creates a cloud-config output that can be used as a basis for Container Linux machine deployments. Cloud-config is usually injected to a machine via user-data during provisioning.

```
$ kontena grid cloud-config
```

For full list of options, see [advanced usage](#advanced-usage)

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
    kontena grid cloud-config [OPTIONS] [NAME]

Parameters:
    NAME                          Grid name

Options:
    --dns DNS                     DNS server
    --grid GRID                   Specify grid to use
    --peer-interface IFACE        Peer (private) network interface (default: "eth1")
    --default-interface-match IFACE-GLOB Match default network interfaces (default: nil)
    --docker-bip BIP              Docker bridge ip (default: "172.17.43.1/16")
    --version VERSION             Agent version (default: "latest")
```
