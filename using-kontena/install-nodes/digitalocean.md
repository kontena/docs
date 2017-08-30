# Creating Kontena Nodes on DigitalOcean

> The following instructions are designed for those who want to create Kontena Nodes using the Kontena CLI built-in provision tool. It is also possible to create Kontena Nodes manually.

* [Prerequisites](#prerequisites)
* [Create Kontena Node](#install-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)

## Prerequisites

* [Kontena CLI](/tools/cli.md) with the `digitalocean` plugin. If you don't have the plugin installed, you can install it with the: `kontena plugin install digitalocean` command.
* A DigitalOcean Account. Visit [https://www.digitalocean.com/](https://www.digitalocean.com/) to get started
* A DigitalOcean API token. Visit [https://cloud.digitalocean.com/settings/api/tokens](https://cloud.digitalocean.com/settings/api/tokens)

## Create Kontena Node

```
$ kontena digitalocean node create
```

## Restart Kontena Node

```
$ kontena digitalocean node restart <NAME>
```

## Terminate Kontena Node

```
$ kontena digitalocean node terminate <NAME>
```

## Update Kontena Node

By default, Kontena Nodes will auto-update to the same version as Kontena Master immediately if the `major` or `minor` version changes (`major.minor.x`). Kontena Nodes will do a patch level auto-update only when rebooted or systemd is restarted. This auto-update process can be forced by executing the following command in every Kontena Node host:

```
$ sudo systemctl restart kontena-agent
```

## Advanced Usage

```
Usage:
    kontena digitalocean node create [OPTIONS] [NAME]

Parameters:
    [NAME]                        Node name

Options:
    --grid GRID                   Specify grid to use
    --token TOKEN                 DigitalOcean API token
    --ssh-key SSH_KEY             Path to ssh public key (default: "~/.ssh/id_rsa.pub")
    --size SIZE                   Droplet size (default: "1gb")
    --region REGION               Region (default: "ams2")
    --version VERSION             Define installed Kontena version (default: "latest")
```
