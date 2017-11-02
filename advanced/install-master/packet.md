# Installing Kontena Platform Master on Packet

## Prerequisites

* [Kontena CLI](cli.md)
* Packet.net Account. Visit [https://www.packet.net/promo/kontena/](https://www.packet.net/promo/kontena/) to get started

## Install Kontena CLI Plugin

```
$ kontena plugin install packet
```

## Install Kontena Platform Master

```
$ kontena packet master create
```

## Advanced Install Options

```
Usage:
    kontena packet master create [OPTIONS]

Options:
    --token TOKEN                 Packet API token
    --project PROJECT ID          Packet project id
    --ssl-cert PATH               SSL certificate file (optional)
    --type TYPE                   Server type (baremetal_0, baremetal_1, ..) (default: "baremetal_0")
    --facility FACILITY CODE      Facility (default: "ams1")
    --billing BILLING             Billing cycle (default: "hourly")
    --ssh-key PATH                Path to ssh public key (optional)
    --vault-secret VAULT_SECRET   Secret key for Vault (optional)
    --vault-iv VAULT_IV           Initialization vector for Vault (optional)
    --mongodb-uri URI             External MongoDB uri (optional)
    --version VERSION             Define installed Kontena version (default: "latest")
```

## Updating Kontena Platform Master

By default, Kontena Platform Master will track the `latest` version tag of Kontena, and will auto-update when the host is rebooted. This auto-update process can be forced by executing the following command in the Kontena Platform Master host:

```
$ sudo systemctl restart kontena-server-api
```
