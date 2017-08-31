# Using Kontena Platform Grids

> Note! This documentation is mostly targeted for people running custom Kontena Platform deployments. People using Kontena Cloud with hosted Kontena Platforms may skip most parts of this documentation since it is not relevant (or applicable).

Kontena Platform Grid is part of Kontena Platform and provides cluster wide abstraction that is required for connecting compute resources and data volumes.

In this chapter, we'll discover how to work with Kontena Platform Grids using Kontena CLI tool:

* [Create a New Kontena Platform Grid](#create-a-new-kontena-platform-grid)
* [Update Kontena Platform Grid Configuration](#update-kontena-platform-grid-configuration)
* [List Kontena Platform Grids](#list-kontena-platform-grids)
* [Switch to Another Kontena Platform Grid](#switch-to-another-kontena-platform-grid)
* [Show Kontena Platform Grid Configuration](#show-kontena-platform-grid-configuration)
* [Remove Kontena Platform Grid](#remove-kontena-platform-grid)
* [Show Kontena Platform Event Logs]()
* [Show Kontena Platform Logs]()
* [Show Kontena Platform Audit Log]()
* [Show Kontena Platform Grid Environment Details]()
* [Show Kontena Platform Grid Cloud-Config]()
* [Manage Kontena Platform Grid Trusted Subnets]()


## Create a New Kontena Platform Grid

> Note! This is not applicable to people using hosted Kontena Platforms from Kontena Cloud since the grid is created automatically.

Create a new Kontena Platform Grid.

```
$ kontena grid create --initial-size=3 <GRID_NAME>
```

This command accepts same options as Kontena Platform create. The only limitation is `region` setting, that is not supported. See the full list of [configuration options](../using-kontena/platform.md#configuration-options).

## Update Kontena Platform Grid Configuration

Update the configuration for current Kontena Platform Grid.

```
$ kontena grid update <GRID_NAME>
```

Just like Kontena Platform Grid create, this command accepts same options as Kontena Platform update. The only limitation is `region` setting, that is not supported. See the full list of [configuration options](../using-kontena/platform.md#configuration-options).

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

#### Show Kontena Platform Grid Agent Configuration

Generate the [`/etc/kontena-agent` environment variables](../references/environment-variables#kontena-agent) required when manually provisioning nodes using grid tokens:

```
$ kontena grid env
KONTENA_URI=ws://192.168.66.1:9292/
KONTENA_TOKEN=yempbjWHbZLhc66gB0mAFXKS8HzS/daDwCfnHC+UfrJo5wkhQ6hpr8XKY5nUdH+h6CH81Y9bQIc4IgTcEEjQCQ==
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
