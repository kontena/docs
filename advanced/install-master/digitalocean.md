# Installing Kontena Platform Master on DigitalOcean

## Prerequisites

- [Kontena CLI](cli.md)
- DigitalOcean Account. Visit [https://www.digitalocean.com/](https://www.digitalocean.com/) to get started
- DigitalOcean API token. Visit [https://cloud.digitalocean.com/settings/api/tokens](https://cloud.digitalocean.com/settings/api/tokens)

## Install Kontena CLI Plugin

```
$ kontena plugin install digitalocean
```

## Install Kontena Platform Master

```
$ kontena digitalocean master create
```

## Advanced Install Options

```
Usage:
    kontena digitalocean master create [OPTIONS]

Options:
    --token TOKEN                 DigitalOcean API token
    --ssh-key SSH_KEY             Path to ssh public key (default: "~/.ssh/id_rsa.pub")
    --ssl-cert SSL CERT           SSL certificate file  (optional)
    --size SIZE                   Droplet size (default: "1gb")
    --region REGION               Region (default: "ams2")
    --vault-secret VAULT_SECRET   Secret key for Vault (optional)
    --vault-iv VAULT_IV           Initialization vector for Vault (optional)
    --mongodb-uri URI             External MongoDB uri (optional)
    --version VERSION             Define installed Kontena version (default: "latest")
```

## Updating Kontena Platform Master

By default, Kontena Platform Master will track `latest` version tag of Kontena, and will auto-update when the host is rebooted. This auto-update process can be forced by executing following command in the Kontena Platform Master host:

```
$ sudo systemctl restart kontena-server-api
```