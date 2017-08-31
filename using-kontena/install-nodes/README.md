# Provisioning Kontena Nodes

Almost any machine may be turned into a Kontena Node (see [system requirements](#system-requirements)).

The easiest way to provision Kontena Nodes is to [use the automatic provisioning tool](#adding-kontena-nodes-with-provision-tool) that is built into Kontena CLI. This tool may be used to provision Kontena Nodes to most major public cloud platforms and for local testing purposes.

Alternatively, you may provision Kontena Nodes manually by following the [manual provisioning instructions](#provisioning-kontena-nodes-manually).

Learn more:

* [Provisioning Kontena Nodes Automatically](#provisioning-kontena-nodes-automatically)
* [Provisioning Kontena Nodes Manually](#provisioning-kontena-nodes-manually)
* [System Requirements](#system-requirements)

## Provisioning Kontena Nodes Automatically

**For local testing purposes:**

* [Virtualbox / Vagrant](vagrant.md)

**For public cloud platforms:**

* [AWS EC2](aws-ec2.md)
* [Azure](azure.md)
* [DigitalOcean](digitalocean.md)
* [Packet](packet.md)
* [UpCloud](upcloud.md)

## Provisioning Kontena Nodes Manually

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

## Kontena Node ID

Kontena Nodes are uniquely identified by their Docker Engine ID, as shown in `docker info`:

```
 ID: 44C7:P5OM:NBJT:WXHV:6EDU:67T5:YDMX:4YPU:PF6D:VUH5:7LE7:5RC7
```

### Node ID Conflicts

Each node must have an unique Node ID that stays the same across reboots, or the Kontena Nodes will not behave correctly.
Duplicate Node IDs will cause both agents to connect as the same Kontena Node, causing the same service instances to be deployed to both machines.
Volatile Node IDs will cause the agent to reconnect as a new Kontena Node (using grid tokens), or be be able to reconnect (using node tokens).

Provisioning nodes using cloned disk images is likely to cause duplicate Node IDs if the cloned disk images already have Docker pre-installed.

Node ID conflicts can be detected by the agent connection conflict errors: `connection closed with code 4041: host node ... connection conflict with new connection at ...`
