# Installing Kontena Platform Master on Azure (classic)

## Prerequisites

- [Kontena CLI](cli.md)
- Azure Account

## Install Kontena CLI Plugin

```
$ kontena plugin install azure
```

## Creating Azure Management Certificate

You can use OpenSSL to create your management certificates. Two certificates are necessary: One for the server (a .cer file) and one for the client (a .pem file). To create the .pem file, execute this command:

```
openssl req -x509 -nodes -days 365 -newkey rsa:1024 -keyout mycert.pem -out mycert.pem
```

To create the .cer certificate, execute this command:

```
openssl x509 -inform pem -in mycert.pem -outform der -out mycert.cer
```

For more information about Azure certificates, see [Certificates Overview for Azure Cloud Services](https://azure.microsoft.com/en-us/documentation/articles/cloud-services-certs-create/). For a complete description of OpenSSL parameters, see the documentation at http://www.openssl.org/docs/apps/openssl.html.

After you have created these files, you will need to upload the .cer file to Azure via the "Upload" action of the "Settings" tab of the [Azure classic portal](https://manage.windowsazure.com/), and you will need to make note of where you saved the .pem file.

## Install Kontena Platform Master

```
$ kontena azure master create
```

## Advanced Install Options

```
Usage:
    kontena azure master create [OPTIONS]

Options:
    --subscription-id SUBSCRIPTION ID Azure subscription id
    --subscription-cert CERTIFICATE Path to Azure management certificate
    --size SIZE                   SIZE (default: "Small")
    --network NETWORK             Virtual Network name
    --subnet SUBNET               Subnet name
    --ssh-key SSH KEY             SSH private key file
    --location LOCATION           Location (default: "West Europe")
    --ssl-cert SSL CERT           SSL certificate file
    --vault-secret VAULT_SECRET   Secret key for Vault
    --vault-iv VAULT_IV           Initialization vector for Vault
    --version VERSION             Define installed Kontena version (default: "latest")
```

## Updating Kontena Platform Master

By default, Kontena Platform Master will the track `latest` version tag of Kontena, and will auto-update when the host is rebooted. This auto-update process can be forced by executing the following command in the Kontena Platform Master host:

```
$ sudo systemctl restart kontena-server-api
```
