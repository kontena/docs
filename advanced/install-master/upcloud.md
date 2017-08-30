# Installing Kontena Platform Master on UpCloud

## Prerequisites

- [Kontena CLI](cli.md)
- UpCloud Account. Visit [https://www.upcloud.com/kontena/](https://www.upcloud.com/kontena/) to get started

## Install Kontena CLI Plugin

```
$ kontena plugin install upcloud
```

## Install Kontena Platform Master

```
$ kontena upcloud master create
```

## Advanced Install Options

```
Usage:
    kontena upcloud master create [OPTIONS]

Options:
    --username USER               Upcloud username
    --password PASS               Upcloud password
    --ssh-key SSH_KEY             Path to ssh public key
    --ssl-cert SSL CERT           SSL certificate file (optional)
    --plan PLAN                   Server plan (default: "1xCPU-1GB")
    --zone ZONE                   Zone (default: "fi-hel1")
    --vault-secret VAULT_SECRET   Secret key for Vault (optional)
    --vault-iv VAULT_IV           Initialization vector for Vault (optional)
    --mongodb-uri URI             External MongoDB uri (optional)
    --version VERSION             Define installed Kontena version (default: "latest")

Note: The username for ssh access is "root"
```

## Updating Kontena Platform Master

By default, Kontena Platform Master will track `latest` version tag of Kontena, and will auto-update when the host is rebooted. This auto-update process can be forced by executing following command in the Kontena Platform Master host:

```
$ sudo systemctl restart kontena-server-api
```