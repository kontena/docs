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

A Kontena Node is any Linux machine running Docker (1.12.x or later) and the Docker `kontena-agent` container.

* [Ubuntu](ubuntu.md)
* [Container Linux](container-linux.md)
* [Docker Compose](docker-compose.md)

### Configuration

Each `kontena-agent` must be configured to connect to the Kontena Platform using [environment variables](../references/environment-variables#kontena-agent).
These environment variables are typically configured on the host machine at `/etc/kontena-agent.env`.

The agent connects to a [Kontena Platform Master](../../advanced/master) by opening a Websocket connection to the `KONTENA_URI=wss://kontena-master.example.com` URL.
The master authenticates the agent using either the `KONTENA_TOKEN` (grid token) or `KONTENA_NODE_TOKEN` (per-node token) secret.
These configuration variables can be generated using the `kontena node env` / `kontena grid env` commands.

### Network Requirements

To operate properly Kontena Nodes must be able to connect to the master, and to other Kontena Nodes. Using the [automatic provisioning tool](#provisioning-kontena-nodes-automatically) will configure these automatically, otherwise, please make sure you have the following network ports are open for your nodes:

* Required: Outgoing TCP port **80** or **443** for the websocket connection to the master
* Required: Incoming/outgoing TCP/UDP port **6783** and **6784** for [Overlay Network connections](../../advanced/networking)
* Optional: Incoming/outgoing IPSec ESP for [Overlay Network Encrpyted Datapath connections](../../advanced/networking#encrypted-datapath)
* Optional: incoming TCP/UDP port **1194*** for [VPN connections](../../tools/vpn-access)
* Optional: incoming TCP port **22** for [SSH connections](../nodes#ssh-into-a-kontena-node)
* Any other ports that you want to expose for your own services

### Websocket SSL Security



### Kontena Token Security


Nodes can be provisioned with unique node tokens using the `KONTENA_NODE_TOKEN=` environment variable.

Nodes provisioned with a Node token must be created beforehand using `kontena node create`.
The server will generate a new token for the node, or `--token` can be used to provide an unique pre-generated token.
Use the CLI `kontena node env` command to generate the `/etc/kontena-agent.env` configuration required for the `kontena-agent` on the new node, including the `KONTENA_NODE_TOKEN=`.

The Kontena Master will use the node token provided by the agent to associate the connection with an existing grid node, as authenticated by the node token.
The grid node will be associated with the Node ID provided by the first agent to connect using the node token.
The same node token cannot be used by any other agent with a different Node ID.
Attempting to provision multiple nodes with the same node token will result in connection errors: `Incorrect node token, already used by a different node`

The node token can also be reset using `kontena node reset-token`.
This will force the agent to disconnect (unless using `--no-reset-connection`), and require the agent `/etc/kontena-agent.env` configuration to be updated using the new `KONTENA_NODE_TOKEN=` from `kontena node env` before it will be able to reconnect.

Decomissioning a node using `kontena node rm` will also revoke the node token, preventing further agent connections to the master using the node token that the node was provisioned with.
If the agent is still connected, removing the node will forcibly disconnect the agent within the next keepalive interval (0-30s): `ERROR -- Kontena::WebsocketClient: master indicates that this agent should not reconnect: host node UXTT:TP...CP:22IC has been removed`

### Kontena Platform Grid Tokens

Nodes can be provisioned with a shared [grid token](grids.md#grid-token) using the `KONTENA_TOKEN=` environment variable.

Nodes provisioned with a Grid token do not need to be explicitly created beforehand.
Use the CLI `kontena grid env` command to generate the environment variables required for configuring `kontena-agent` on the new node, including the `KONTENA_TOKEN`.

The Kontena Master will use the Node ID provided by the agent to associate the connection with a node in the correct grid, as authenticated by the grid token.
The master will automatically create a new grid node if a new `kontena-agent` connects with a valid grid token and previously unknown Node ID.

The grid token cannot be revoked.
Nodes provisioned using grid tokens that are still online cannot be removed using `kontena node rm`, as the agent would quickly reconnect and the node would get re-created by the server.
If an offline node using a grid token is removed, and the agent later reconnects, the node will re-appear in the grid.

Existing nodes configured to connect with grid tokens can be upgraded to use node tokens using `kontena node reset-token` to generate a node token.
This will force the agent to disconnect, and require the agent `/etc/kontena-agent.env` configuration to be updated using the new `KONTENA_NODE_TOKEN=` from `kontena node env` before it will be able to reconnect.
The `kontena node reset-token --clear-token` command can be used to revert back to the grid token.

### Kontena Node ID

Kontena Nodes are uniquely identified by their Docker Engine ID, as shown in `docker info`:

```
 ID: 44C7:P5OM:NBJT:WXHV:6EDU:67T5:YDMX:4YPU:PF6D:VUH5:7LE7:5RC7
```

#### Node ID Conflicts

Each node must have an unique Node ID that stays the same across reboots, or the Kontena Nodes will not behave correctly.
Duplicate Node IDs will cause both agents to connect as the same Kontena Node, causing the same service instances to be deployed to both machines.
Volatile Node IDs will cause the agent to reconnect as a new Kontena Node (using grid tokens), or be be able to reconnect (using node tokens).

Provisioning nodes using cloned disk images is likely to cause duplicate Node IDs if the cloned disk images already have Docker pre-installed.

Node ID conflicts can be detected by the agent connection conflict errors: `connection closed with code 4041: host node ... connection conflict with new connection at ...`

## Decomissioning nodes

Use the `kontena node rm` command to decomission a node.

If the node was provisioned using a grid token, then the node must first be terminated to stop the agent and force it to disconnect from the master, and then the `kontena node rm` command can be used to remove the offline node.
The `kontena node rm` command will refuse to remove an online node that was provisioned with a grid token.

Nodes created using `kontena node create` and provisioned using a node token can be removed using `kontena node rm`, even if they are online.
The agent will be disconnected and will be unable to reconnect, as the node token will be invalidated.
This can be used as a security feature to isolate compromised nodes from the grid.

Use the `kontena <provider> node terminate` plugin commands to terminate nodes and remove them from the Kontena Master.
Alternatively, power off and destroy the node instance directly from the provider's control panel, and wait for the nodes to be offline before removing them from the CLI.

Any service instances deployed to a removed node will be invalidated, and can be re-deployed to a different node.
This happens automatically for stateless services, similar to behavior of offline nodes, but without the grace period.
For stateful services, any instances on removed nodes will be re-scheduled on the next service deploy, and the replacement service instances will lose their state.
