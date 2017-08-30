# Creating Kontena Nodes on AWS EC2

> The following instructions are designed for those who want to create Kontena Nodes using the Kontena CLI built-in provision tool. It is also possible to create Kontena Nodes manually.

* [Prerequisites](#prerequisites)
* [Create Kontena Node](#install-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)

## Prerequisites

* [Kontena CLI](/tools/cli.md) with the `aws` plugin. If you don't have the plugin installed, you can install it with the: `kontena plugin install aws` command.
* An AWS Account. Visit [http://aws.amazon.com](http://aws.amazon.com) to get started.
* An AWS [instance profile and role](http://docs.aws.amazon.com/IAM/latest/UserGuide/instance-profiles.html) with full EC2 access.

## Create Kontena Node

```
$ kontena aws node create
```

## Restart Kontena Node

```
$ kontena aws node restart <NAME>
```

## Terminate Kontena Node

```
$ kontena aws node terminate <NAME>
```

## Update Kontena Node

By default, Kontena Nodes will auto-update to the same version as Kontena Master immediately if the `major` or `minor` version changes (`major.minor.x`). Kontena Nodes will do a patch level auto-update only when rebooted or systemd is restarted. This auto-update process can be forced by executing the following command in every Kontena Node host:

```
$ sudo systemctl restart kontena-agent
```

## Advanced Usage

```
Usage:
    kontena aws node create [OPTIONS] [NAME]

Parameters:
    [NAME]                        Node name

Options:
    --grid GRID                   Specify grid to use
    --access-key ACCESS_KEY       AWS access key ID
    --secret-key SECRET_KEY       AWS secret key
    --key-pair KEY_PAIR           EC2 Key Pair
    --region REGION               EC2 Region (default: "eu-west-1")
    --zone ZONE                   EC2 Availability Zone (default: "a")
    --vpc-id VPC ID               Virtual Private Cloud (VPC) ID (default: default vpc)
    --subnet-id SUBNET ID         VPC option to specify subnet to launch instance into (default: first subnet in vpc/az)
    --type SIZE                   Instance type (default: "t2.small")
    --storage STORAGE             Storage size (GiB) (default: "30")
    --version VERSION             Define installed Kontena version (default: "latest")
    --associate-public-ip-address Whether to associated public IP in case the VPC defaults to not doing it (default: true)
    --security-groups SECURITY GROUPS Comma-separated list of security groups (names) where the new instance will be attached (default: create grid specific group if not already existing)
```
