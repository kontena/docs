# Using Kontena Stacks

[Kontena Stacks](./README.md#kontena-stacks) describe a complete containerized solution with a lifecycle. It contains number of Kontena Services that abstract container workloads.

In this chapter, we'll discover how to manage, operate and monitor Kontena Stacks using Kontena CLI tool:

* [Creating a Kontena Stack](#creating-a-kontena-stack)
* [Building a Kontena Stack](#building-a-kontena-stack)
* [Installing a Kontena Stack](#installing-a-kontena-stack)
* [Upgrading a Kontena Stack](#upgrading-a-kontena-stack)
* [Deploying a Kontena Stack](#deploying-a-kontena-stack)
* [Removing a Kontena Stack](#removing-a-kontena-stack)
* [Listing Installed Kontena Stacks](#listing-installed-kontena-stacks)
* [Displaying Kontena Stack Configuration](#displaying-kontena-stack-configuration)
* [Inspecting Kontena Stack Logs](#inspecting-kontena-stack-logs)
* [Monitoring Kontena Stack](#monitoring-kontena-stack)
* [Validating Kontena Stack File](#validating-kontena-stack-file)

## Creating a Kontena Stack

You can create Kontena Stack by writing a [Kontena Stack File](./stack-file.md) using your favorite text editor.

## Building a Kontena Stack

The command (for extra convenience) that may be used for building and pushing Docker images referenced by a Kontena Stack File.

```
$ kontena stack build
```

## Installing a Kontena Stack

The command that may be used for installing Kontena Stack on Kontena Platform.

```
$ kontena stack install
```

The supported options:

* **`name`** - Specify the name that shall be used for this Kontena Stack once installed. This option may be used to override the name described in the Kontena Stack File.
* **`no-deploy`** - By default the Kontena Stack is deployed right away. This option may be used to instantiate the Kontena Stack without deploy (no Kontena Services will be created or started yet). The deploy may be executed manually later using the [deploy](#deploying-a-kontena-stack) command.
* **`values-to`** - Output variable values as YAML to file.
* **`values-from`** - Read Kontena Stack variable values from YAML.
* **`values-from-stack`** - Read Kontena Stack variable values from another installed Kontena Stack on Kontena Master.
* **`v`** - Set individual variable values: `-v variable_name=variable_value` or `-v child_stack.variable_name=variable_value`. Can be used multiple times.

## Upgrading a Kontena Stack

The command that may be used for upgrading Kontena Stack on Kontena Platform.

```
$ kontena stack upgrade <STACK_NAME>
```

The supported options:

* **`no-deploy`** - By default the Kontena Stack upgrade is applied and deployed right away. This option may be used just to apply upgrade without deploy. The deploy may be executed manually later using the [deploy](#deploying-a-kontena-stack) command.
* **`values-to`** - Output variable values as YAML to file.
* **`values-from`** - Read Kontena Stack variable values from YAML.
* **`values-from-stack`** - Read Kontena Stack variable values from another installed Kontena Stack on Kontena Master.
* **`v`** - Set individual variable values: `-v variable_name=variable_value` or `-v child_stack.variable_name=variable_value`. Can be used multiple times.
* **`dry-run`** - Simulate upgrade, displays a report of changes that an upgrade would make.
* **`force`** - Force upgrade.

## Deploying a Kontena Stack

The command that may be used for deploying Kontena Stack that has been [installed](#installing-a-kontena-stack) or [upgraded](#upgrading-a-kontena-stack) with `no-deploy` option.

```
$ kontena stack deploy <STACK_NAME>
```

## Removing a Kontena Stack

The command that may be used for removing installed Kontena Stack and all associated Kontena Services, including all data volumes that are associated with those Kontena Services.

```
$ kontena stack remove <STACK_NAME>
```

## Listing Installed Kontena Stacks

The command that may be used for listing all installed Kontena Stacks in a Kontena Platform.

```
$ kontena stack list
```

## Displaying Kontena Stack Configuration

The command that may be used for displaying configuration of a Kontena Stack.

```
$ kontena stack show <STACK_NAME>
```

## Inspecting Kontena Stack Logs

The command that may be used for showing Kontena Stack logs in real time.

```
$ kontena stack logs <STACK_NAME>
```

The supported options:

* **`tail`** - Follow logs. Default: `false`.
* **`lines`** - Number of lines to show from the end of the logs. Default: `100`.
* **`since`** - Show logs since given timestamp.

## Monitoring Kontena Stack

The command that may be used for monitoring Kontena Stack in real time.

```
$ kontena stack monitor <STACK_NAME>
```

## Validating Kontena Stack File

Validate Kontena Stack File by inspecting the structure, template language and variable substitutions.

```
$ kontena stack validate
```
