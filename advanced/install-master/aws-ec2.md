# Installing Kontena Platform Master on AWS EC2

## Prerequisites

- [Kontena CLI](cli.md)
- AWS Account. Visit [http://aws.amazon.com](http://aws.amazon.com) to get started.
- AWS [instance profile and role](http://docs.aws.amazon.com/IAM/latest/UserGuide/instance-profiles.html) with full EC2 access

## Install Kontena CLI Plugin

```
$ kontena plugin install aws
```

## Install Kontena Platform Master

```
$ kontena aws master create
```

## Advanced Install Options

```
Usage:
    kontena aws master create [OPTIONS]

Options:
    --access-key ACCESS_KEY       AWS access key ID
    --secret-key SECRET_KEY       AWS secret key
    --key-pair KEY_PAIR           EC2 key pair name
    --ssl-cert SSL CERT           SSL certificate file (default: generate self-signed cert)
    --region REGION               EC2 Region (default: "eu-west-1")
    --zone ZONE                   EC2 Availability Zone (default: "a")
    --vpc-id VPC ID               Virtual Private Cloud (VPC) ID (default: default vpc)
    --subnet-id SUBNET ID         VPC option to specify subnet to launch instance into (default: first subnet from vpc/az)
    --type SIZE                   Instance type (default: "t2.small")
    --storage STORAGE             Storage size (GiB) (default: "30")
    --vault-secret VAULT_SECRET   Secret key for Vault (default: generate random secret)
    --vault-iv VAULT_IV           Initialization vector for Vault (default: generate random iv)
    --mongodb-uri URI             External MongoDB uri (optional)
    --version VERSION             Define installed Kontena version (default: "latest")
    --associate-public-ip-address Whether to associated public IP in case the VPC defaults to not doing it (default: true)
    --security-groups SECURITY_GROUPS Comma separated list of security groups (names) where the new instance will be attached (default: create 'kontena_master' group if not already existing)
```

## Updating Kontena Platform Master

By default, thr Kontena Platform Master will track the `latest` version tag of Kontena, and will auto-update when the host is rebooted. This auto-update process can be forced by executing the following command in the Kontena Platform Master host:

```
$ sudo systemctl restart kontena-server-api
```
