# Creating Kontena Nodes on Azure (classic)

> The following instructions are designed for those who want to create Kontena Nodes using the Kontena CLI built-in provision tool. It is also possible to create Kontena Nodes manually.

* [Prerequisites](#prerequisites)
* [Create Kontena Node](#install-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)

## Prerequisites

* [Kontena CLI](/tools/cli.md) with the `azure` plugin. If you don't have the plugin installed, you can install it with the: `kontena plugin install azure` command.
* An Azure Account.
* An [Azure Management Certificate](https://azure.microsoft.com/en-us/documentation/articles/cloud-services-certs-create/)
  * You can use OpenSSL to create your management certificates. Two certificates are necessary: one for the server (a .cer file) and one for the client (a .pem file).
  * To create the .pem file, execute this command: `openssl req -x509 -nodes -days 365 -newkey rsa:1024 -keyout mycert.pem -out mycert.pem`
  * To create the .cer certificate, execute this command: `openssl x509 -inform pem -in mycert.pem -outform der -out mycert.cer`
  * For a complete description of OpenSSL parameters, see the documentation at http://www.openssl.org/docs/apps/openssl.html.
  * After you have created these files, you will need to upload the .cer file to Azure via the "Upload" action of the "Settings" tab of the [Azure classic portal](https://manage.windowsazure.com/), and you will need to make note of where you saved the .pem file.

## Create Kontena Node

```
$ kontena azure node create
```

## Restart Kontena Node

```
$ kontena azure node restart <NAME>
```

## Terminate Kontena Node

```
$ kontena azure node terminate <NAME>
```

## Update Kontena Node

By default, Kontena Nodes will auto-update to the same version as Kontena Master immediately if the `major` or `minor` version changes (`major.minor.x`). Kontena Nodes will do a patch level auto-update only when rebooted or systemd is restarted. This auto-update process can be forced by executing the following command in every Kontena Node host:

```
$ sudo systemctl restart kontena-agent
```

## Advanced Usage

```
Usage:
    kontena azure node create [OPTIONS] [NAME]

Parameters:
    [NAME]                        Node name

Options:
    --grid GRID                   Specify grid to use
    --subscription-id SUBSCRIPTION ID Azure subscription id
    --subscription-cert CERTIFICATE Path to Azure management certificate
    --size SIZE                   SIZE (default: "Small")
    --network NETWORK             Virtual Network name
    --subnet SUBNET               Subnet name
    --ssh-key SSH KEY             SSH private key file
    --location LOCATION           Location (default: "West Europe")
    --version VERSION             Define installed Kontena version (default: "latest")
```
