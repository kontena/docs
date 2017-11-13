# Using Kontena Volumes

[Kontena Volumes](./README.md#kontena-volumes) provide storage (persistent; local or external) for stateful services. A Kontena Volume contains a volume configuration that abstracts an actual physical volume location. Once defined, it will be made available for Kontena Stacks via your Kontena Platform.

In this chapter, we'll discover how to manage Kontena Volumes with Kontena CLI Tool: 

* [Create a Kontena Volume]()
* [List Kontena Volumes]()
* [Display Kontena Volume Details]()
* [Remove a Kontena Volume]()

## Create a Kontena Volume

Create a new infrastructure agnostic Kontena Volume that may be used by Kontena Stacks and Kontena Services via Kontena Stack Files.

```
$ kontena volume create --driver <DRIVER> --scope <SCOPE> <VOLUME_NAME>
```

The options explained:

* **`driver`** - Specify a Kontena Volume driver (***Required***). The driver must be specified without a version tag. For example: `rexray/s3fs`. Kontena will match the reported plugin version automatically and thus is able to create and manage the volumes. Drivers available by default: `local`.
* **`scope`** - Specify how the Kontena Volume will be instantiated when used by Kontena Services (***Required***). Valid scopes are: `instance`, `stack` or `grid`. The suitable scope highly depends on the service using the data and the volume driver providing the actual data persistence:
  * **`instance`** - The Kontena Volume will be created for a Kontena Service Instance. In practice, each container will get their own volume. This is suitable for Kontena Services where each instance should have their own data and possible data replication happens at the application layer. Please note, with this scope, your Kontena Platform will prefer scheduling Kontena Services to the Kontena Node where the volume was initially created. If that Kontena Node is unavailable for some reason, other Kontena Nodes are used.
  * **`stack`** - The Kontena Volume will be created for Kontena Stack. In practice, each Kontena Stack will get a volume that may be shared among all the Kontena Services in this Kontena Stack. This is suitable for Kontena Services that need to share the same data between different instances. Please note, the volume driver must take care of the data replication between volumes created on different Kontena Nodes.
  * **`grid`** - The Kontena Volume will be created for your Kontena Platform. In practice, each Kontena Platform will get a volume that may be shared among all Kontena Stacks and Services. This is suitable for Kontena Stacks and Services that need to share the same data. Please note, the volume driver must take care of the data replication between volumes created on different Kontena Nodes. This may be also useful for importing existing Docker volumes, since Kontena will use the exact volume name for the Docker volume. 

**NOTE:** There should be always only one version of a v2 volume plugin installed on a node at any given time. Having multiple versions installed will make volumes seen multiple times on a node and thus makes the automatic selection of correct volume and driver impossible. If not using the default latest version, then it is advisable to install the plugins with `--alias`, as that allows smoother (and less confusing) upgrades of the plugins.

## List Kontena Volumes

List all Kontena Volumes that have been previously created.

```
$ kontena volume ls
```

## Display Kontena Volume Details

Display details about a previously created Kontena Volume.

```
$ kontena volume show <NAME>
```

## Remove a Kontena Volume

Remove a Kontena Volume that has been created earlier. Trying to remove a Kontena Volume that is still being used by any Kontena Service will fail.

```
$ kontena volume rm <NAME>
```

**IMPORTANT!**  Deleting an unused volume will remove the underlying Docker volumes from the Kontena Nodes. Depending on the volume driver used, this may actually also remove the backing storage for the volume.
