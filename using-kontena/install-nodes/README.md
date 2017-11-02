# Add Kontena Nodes

Almost any machine may be turned into a Kontena Node (see [system requirements](#system-requirements)).

The easiest way for adding Kontena Nodes is to [use the provisioning tool](#adding-kontena-nodes-with-provision-tool) that is built into the Kontena CLI. This tool may be used to provision Kontena Nodes to Kontena Cloud, most major public cloud platforms and for local testing purposes.

Alternatively, you may add Kontena Nodes manually by following the [manual install instructions](#adding-kontena-nodes-manually).

Learn more:

* [Adding Kontena Nodes With Provision Tool](#adding-kontena-nodes-with-provision-tool)
* [Adding Kontena Nodes Manually](#adding-kontena-nodes-manually)
* [System Requirements](#system-requirements)

## Adding Kontena Nodes With Provision Tool

**For public cloud platforms:**

* [Kontena Cloud](cloud.md)
* [AWS EC2](aws-ec2.md)
* [Azure](azure.md)
* [DigitalOcean](digitalocean.md)
* [Packet](packet.md)
* [UpCloud](upcloud.md)

**For local testing purposes:**

* [Virtualbox / Vagrant](vagrant.md)

## Adding Kontena Nodes Manually

* [Ubuntu](ubuntu.md)
* [Container Linux](container-linux.md)
* [Docker Compose](docker-compose.md)

## System Requirements

Kontena Node software may be installed on any (virtual) machine that is able to run Docker 1.12.x or later.

To operate properly Kontena Nodes need only a few ports opened. If you are adding Kontena Nodes with the provision tool built-in to Kontena CLI, those ports should be opened automatically for you. If you are adding Kontena Nodes manually, please make sure you have the following ports open:

* **6783-6784** - For overlay network connections between nodes. TCP+UDP
* **1194** - For possible incoming VPN connection _(optional)_.
* **22** - For possible incoming SSH connections _(optional)_.
* Any other port that you might want to expose for your services.

In addition, please ensure [IPSec (ESP)](https://tools.ietf.org/html/rfc2406) traffic is allowed.

## Kontena Node Id

Kontena Nodes are identified by their Docker Engine ID, as shown in `docker info`:

```
 ID: 44C7:P5OM:NBJT:WXHV:6EDU:67T5:YDMX:4YPU:PF6D:VUH5:7LE7:5RC7
```
