# Using Kontena Nodes

[Kontena Nodes](./README.md#kontena-nodes) (machines; bare metal or virtual) provide all the compute resources for a Kontena Platform.

In this chapter, we'll discover how to manage, operate and monitor Kontena Nodes with the Kontena CLI tool:

* [Add Kontena Nodes](#add-kontena-nodes)
* [List Kontena Nodes](#list-kontena-nodes)
* [Show Kontena Node Information](#show-kontena-node-information)
* [Update Kontena Node Information](#update-kontena-node-information)
* [SSH into a Kontena Node](#ssh-into-a-kontena-node)
* [Remove a Kontena Node](#remove-a-kontena-node)
* [Manage Kontena Node Labels](#manage-kontena-node-labels)
* [Check Kontena Node Health Status](#check-kontena-node-health-status)

## Add Kontena Nodes

Please see the [Add Kontena Nodes](install-nodes/README.md) documentation to learn more.

## Create Kontena Nodes

Create a new Kontena Node for manual provisioning:

```
$ kontena node create core-03
 [done] Creating core-03 node      
```

The server will generate a random node token by default. Use `--token` to supply a pre-generated node token.

The new node must be provisioned using the `kontena node env` configuration.

## List Kontena Nodes

The command that may be used for listing all Kontena Nodes in a Kontena Platform.

```
$ kontena node list
NAME        VERSION     STATUS    INITIAL   LABELS
⊛ core-01   1.4.0       online    1 / 1     provider=vagrant
⊛ core-02   1.4.0       online    -         provider=vagrant
⊝ core-03   1.4.0       offline   -         -
```

## Show Kontena Node Information

The command that may be used for inspecting Kontena Node information.

```
$ kontena node show <NODE_ID>
```

## Show Kontena Node Agent Configuration

Generate the [`/etc/kontena-agent` environment variables](../references/environment-variables#kontena-agent) required when manually provisioning nodes using node tokens:

```
$ kontena node env core-03
KONTENA_URI=ws://192.168.66.1:9292/
KONTENA_NODE_TOKEN=yempbjWHbZLhc66gB0mAFXKS8HzS/daDwCfnHC+UfrJo5wkhQ6hpr8XKY5nUdH+h6CH81Y9bQIc4IgTcEEjQCQ==
```

See [`kontena grid env`](./platform.md#show-kontena-platform-grid-agent-configuration) or [`kontena node reset-token`](#reset-a-kontena-node-token) if the node was not created using `kontena node create`.

## Update Kontena Node Information

```
$ kontena node update <NODE_ID>
```

## SSH into a Kontena Node

The command that may be used for connecting to Kontena Node via SSH.

```
$ kontena node ssh <NODE_ID>
```

## Reset a Kontena Node Token

The `kontena node reset-token` command can be used to replace a compromised node token, upgrade a node that was originally provisioned using a grid token, or revert a node to using a grid token:

```
$ kontena node reset-token <NODE_ID>
```

Resetting the token of an online Kontena Node will force the agent to disconnect. The agent will not be able to reconnect until the the node is reconfigured using the new `kontena node env` values.

The `kontena node reset-token` command can also be used to upgrade a node provisioned using a grid token. The node must be reconfigured using the new `kontena node env` configuration before it will be able to reconnect. The `kontena node reset-token --clear-token` command can be used to revert back to the grid token.


## Remove a Kontena Node

The `kontena node remove` command can be used to remove a node that is being decomissioned:

```
$ kontena node remove <NODE_ID>
```

If the node was provisioned using the Kontena CLI built-in provisioning tool, you can terminate the host machine using the `kontena <provider> node terminate` command. This will also remove the Kontena Node. If the host machine has already been terminated, then the `kontena node remove` command can be used to forget the terminated node.

If the node was provisioned with a node token, then the `kontena node remove` command can also be used to invalidate the node token, forcing the agent to disconnect if it is still connected. Nodes provisioned using grid tokens cannot be removed if they are still online, because the agent would simply reconnect and the node would quickly re-appear.

**IMPORTANT!** If you remove a Kontena Node that has `stateful` Kontena Service instances deployed, those Kontena Service instances will be re-scheduled for the next Kontena Service deploy and lose their state.

## Manage Kontena Node Labels

The commands that may be used for managing Kontena Node labels. The labels are defined in the form of `label` or `label=value`. These labels can be used as Kontena Service affinity rule filters.

If a Kontena Node has been added with the Kontena CLI built-in [provision tool](#adding-kontena-nodes-with-provision-tool), some special labels are set automatically and they are recognized by Kontena Platform to provide more efficient operations. These labels include:

* **`provider`** - Specify a cloud platform for a Kontena Node. For example all Kontena Nodes provisioned to Amazon AWS using the provision tool, will have the label `provider=aws` automatically set up.
* **`az`** - Specify an availability zone for a Kontena Node. For example all Kontena Nodes provisioned to Amazon AWS `us-west-1` availability zone will have the label `az=us-west-1` automatically set up. This label is used by the Kontena Service `ha` (high availability) deployment strategy to distribute Kontena Services across different availability zones.
* **`ephemeral`** - Specify if the Kontena Node is ephemeral (temporary). Kontena Nodes that are labeled with `ephemeral=yes` will be automatically removed after they have been offline for longer than six (6) hours. Ephemeral nodes are typically used with auto scaling infrastructure. They are typically provisioned and terminated automatically. Please note, Kontena Nodes labeled as ephemeral are not available for scheduling stateful services.


#### List Labels

```
$ kontena node label list <NODE_ID>
```

#### Add a Label

```
$ kontena node label add <NODE_ID> <LABEL>
```

#### Remove a Label

```
$ kontena node label remove <NODE_ID> <LABEL>
```

## Check Kontena Node Health Status

The command that may be used for inspecting a Kontena Node's health status.

```
$ kontena node health <NODE_ID>
```
