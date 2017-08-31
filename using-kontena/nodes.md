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

## List Kontena Nodes

The command that may be used for listing all Kontena Nodes in a Kontena Platform.

```
$ kontena node list
```

## Show Kontena Node Information

The command that may be used for inspecting Kontena Node information.

```
$ kontena node show <NODE_ID>
```

## Update Kontena Node Information

```
$ kontena node update <NODE_ID>
```

## SSH into a Kontena Node

The command that may be used for connecting to Kontena Node via SSH.

```
$ kontena node ssh <NODE_ID>
```

## Remove a Kontena Node

In order to remove a Kontena Node, it must be terminated first. Once terminated, it may be removed. Only `offline` Kontena Nodes may be removed.

```
$ kontena node remove <NODE_ID>
```

If you are using the Kontena CLI built-in provision tool, you can terminate Kontena Node using the `kontena <provider> node terminate` command. Alternatively, power off / terminate the Kontena Node machine from any infrastructure you are using and wait for the machine to become offline before removing them.

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

## Manage Kontena Node availability

 Node availablity for scheduling services can be controlled with `kontena node update --availability` command. The current supported states are: `drain` and `active`.

 Nodes availablity status can be seen using `kontena node show xyz`:
 ```
 $ k node show moby
 moby:
   id: BCKY:WMSM:IMW4:KSNQ:C2MZ:4EZ7:ZG7J:5UQ2:MMA3:NYK7:5PEF:JBLN
  agent version: 1.3.0.dev
  docker version: 1.13.1
  connected: yes
  availability: drain
  last connect: 2017-05-15T06:03:01.720Z
  last seen: 2017-05-15T06:03:00.523Z
 ... snip ...
 ```
 
 #### Active

 Kontena scheduler can assign tasks into any node marked as `active` availability. `active` is also the default state for all nodes. To re-activate a node use `kontena node update --availability active moby`

 #### Drain

 For a planned maintenance or node decommisioning it is a good idea to first drain the node so there are minimal disruptions on the services running. To drain the services from a node use `kontena node update --availability drain moby`

 Node draining means that all the stateless services will be re-scheduled immediately out from the node. Any stateful services running on that node will be stopped.

 Once the maintenance is over and a node can be put back to work it can be put into active state using `kontena node update --availability active moby` command. This marks the node back in a `active` state where it will get new deployments as Kontena scheduler will see this node back in the available nodes list.
