# Using Kontena Platform Grids

Kontena Platform Grid is part of Kontena Platform and provides cluster wide abstraction that is required for connecting compute resources and data volumes.

In this chapter, we'll discover how to work with Kontena Platform Grids using Kontena CLI tool:

* [Create a New Kontena Platform Grid](#create-a-new-kontena-platform-grid)
* [Update Kontena Platform Grid Configuration](#update-kontena-platform-grid-configuration)
* [List Kontena Platform Grids](#list-kontena-platform-grids)
* [Switch to Another Kontena Platform Grid](#switch-to-another-kontena-platform-grid)
* [Show Kontena Platform Grid Configuration](#show-kontena-platform-grid-configuration)
* [Import Kontena Platform Grid to Kontena Cloud](#import-kontena-platform-grid-to-kontena-cloud)
* [Remove Kontena Platform Grid](#remove-kontena-platform-grid)
* [Show Kontena Platform Event Logs](#show-kontena-platform-event-logs)
* [Show Kontena Platform Logs](#show-kontena-platform-logs)
* [Show Kontena Platform Audit Log](#show-kontena-platform-audit-log)
* [Show Kontena Platform Grid Environment Details](#show-kontena-platform-grid-environment-details)
* [Show Kontena Platform Grid Cloud-Config](#show-kontena-platform-grid-cloud-config)
* [Manage Kontena Platform Grid Trusted Subnets](#manage-kontena-platform-grid-trusted-subnets)


## Create a New Kontena Platform Grid

Create a new Kontena Platform Grid.

```
$ kontena grid create --initial-size=3 <GRID_NAME>
```

<h6 id="configuration-options">Configuration Options (* available only on create)</h6>

* **`initial-size`*** - Specify the initial size of your Kontena Platform. This is a required option. While it is possible to use any value here, the suggested values are: 1, 3 or 5. Please see the [Initial Nodes](../using-kontena/README.md#initial-nodes) documentation for further details.
* **`supernet`*** - Specify the supernet used by your Kontena Platform for IPAM (IP address management). By default, this subnet is set to `10.80.0.0/12`. This option should be used if the underlying network infrastructure used by Kontena Nodes overlaps with the default supernet. See the [Network Model](./networking.md#grid) documentation for further details.
* **`subnet`*** - Specify the subnet used by your Kontena Platform for overlay networking. This subnet must be inside the supernet (as described above). By default, this subnet is set to `10.81.0.0/16`. Just like the supernet, this option should be used if the underlying network infrastructure used by Kontena Nodes overlaps with the default subnet. See the [Network Model](./networking.md#grid) documentation for further details.
* **`token`*** - Specify the Kontena Platform Grid token. The token is used for provisioning Kontena Nodes. It is also used as a shared secret for the overlay networking encryption.
* **`default-affinity`** - Specify the default affinity rule for the entire Kontena Platform using the affinity filter syntax. The default affinity rule is applied to all Kontena Stacks on this Kontena Platform by default. The most common use case is to prevent Kontena Stack deployments to specific Kontena Nodes unless specified in Kontena Stacks.
* **`no-default-affinity`** - Disable any previously set default affinity (as described above). Please note, changing the default affinity may trigger re-scheduling for the entire Kontena Platform.
* **`statsd-server`** - Specify the [statsd](https://github.com/etsy/statsd) server that will listen for [Kontena Statistics](../using-kontena/stats.md) data. If configured, Kontena Nodes will send stats to this address using the UDP [StatsD protocol](https://github.com/b/statsd_spec). Please note:
  * The address is specified as `HOST:PORT`.
  * See examples and learn more about exporting Kontena Statistics [here](../using-kontena/stats.md).
* **`no-statsd-server`** - Disable any previously set [statsd-server](#statsd-server).
* **`log-forwarder`** - [Configure an external log collection service](../using-kontena/logs.md#configuring-external-log-collection-service) that may be used to collect logs from your Kontena Platform. **Note!** If you enable log forwarding, you must also set the log forwarder configuration options `log-opts`. Possible values include:
  * `fluentd` - Enable log forwarding to [FluentD](https://www.fluentd.org/). See below how to configure the FluentD server with the `log-opts` option. See the exported [tags and data structure](../using-kontena/logs.md#fluentd-log-forwarding-details).
  * `none` - Disable log forwarding
* **`log-opts`** - Specify configuration for the log forwarder (as described above). At the moment log forwarding is only supported for FluentD. If you enable log forwarding, you need to specify the FluentD server address here using the following format: `fluentd-server=<HOST>:<PORT>`, where `HOST` is the FluentD server address and `PORT` is the FluentD server port. Example: enable log forwarding to FluentD `kontena grid update --log-forwarder=fluentd --log-opt=fluentd-server=xyz:22445 staging`

## Update Kontena Platform Grid Configuration

Update the configuration for current Kontena Platform Grid.

```
$ kontena grid update <GRID_NAME>
```

The configuration options are the same with Kontena Platform Grid `create`. See the list of supported configuration options [above](#configuration-options).

## Import Kontena Platform Grid to Kontena Cloud

It's possible to connect Kontena Platform Grid to the [Kontena Cloud](https://www.kontena.io/cloud) as a Kontena Platform. This allows you to monitor, analyze and operate your custom Kontena Platform Grid via [Kontena Cloud](https://www.kontena.io/cloud).

To connect your Kontena Platform Grid to Kontena Cloud, use following command:

```
$ kontena cloud platform join [--organization=<ORGANIZATION>] <MASTER_NAME> <GRID_NAME> <PLATFORM_NAME>
```

> **Note!** You need to install Kontena CLI cloud plugin `kontena plugin install cloud` for cloud subcommands.


## List Kontena Platform Grids

List all Kontena Platform Grids.

```
$ kontena grid list
```

## Switch to Another Kontena Platform Grid

Switches CLI context to another Kontena Platform Grid.

```
$ kontena grid use <GRID_NAME>
```

## Show Kontena Platform Grid Configuration

Show details of current Kontena Platform Grid.

```
$ kontena grid current
```

## Remove Kontena Platform Grid

Remove a Kontena Platform Grid.

```
$ kontena grid remove <GRID_NAME>
```

## Show Kontena Platform Event Logs

Show all life-cycle events.

```
$ kontena grid events
```

## Show Kontena Platform Logs

Show logs from Kontena Stacks and Services.

```
$ kontena grid logs
```

## Show Kontena Platform Audit Log

Show audit logs.

```
$ kontena grid audit-log
```

## Show Kontena Platform Grid Environment Details

Outputs currently used Kontena Platform Grid environment variables that can be used to configure Kontena CLI.

```
$ kontena grid env
```

## Show Kontena Platform Grid Cloud-Config

Outputs cloud-config YAML that can be used as a basis for installing and joining Kontena Nodes to current Kontena Platform.

```
$ kontena grid cloud-config
```

## Manage Kontena Platform Grid Trusted Subnets

If some of the Grid nodes are colocated in a trusted network (for example, within the boundary of your own datacenter) you can add subnets to a Grid's trusted subnet list. This disables data plane encryption within a trusted subnet and switches overlay to faster (near-native) mode as an optimization.

#### List Trusted Subnets

```
$ kontena grid trusted-subnet ls
```

#### Add Trusted Subnet

```
$ kontena grid trusted-subnet add <grid> <subnet>
```

#### Remove Trusted Subnet

```
$ kontena grid trusted-subnet remove <grid> <subnet>
```
