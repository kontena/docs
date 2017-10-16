# Kontena Platform Master

> Note! This documentation is mostly targeted for people running custom Kontena Platform deployments. People using Kontena Cloud with hosted Kontena Platforms may skip most parts of this documentation since it is not relevant (or applicable).

The [Kontena Platform Master](../using-kontena/README.md#kontena-platform-master) is a machine (or number of machines in high-availability setup) that provides the management API for using Kontena.

In this chapter, we'll discover how to manage, operate and monitor custom Kontena Platform Master:

* [Install Kontena Platform Master](#install-kontena-platform-master)
* [List Kontena Platform Masters](#list-kontena-platform-masters)
* [Remove Kontena Platform Master](#remove-kontena-platform-master)
* [Configure Kontena Platform Master](#configure-kontena-platform-master)
* [Switch Current Kontena Platform Master](#switch-current-kontena-platform-master)
* [Show Current Kontena Platform Master Details](#show-current-kontena-platform-master-details)
* [Login to Kontena Platform Master](#login-to-kontena-platform-master)
* [Logout from Kontena Platform Master](#logout-from-kontena-platform-master)
* [Manage Kontena Platform Master Access Tokens](#manage-kontena-platform-master-access-tokens)
* [Join to Kontena Platform Master Using Invitation Code](#join-to-kontena-platform-master-using-invitation-code)
* [Show Kontena Platform Master Audit Log](#show-kontena-platform-master-audit-log)
* [Connect Kontena Platform Master to Kontena Cloud](#connect-kontena-platform-master-to-kontena-cloud)
* [Connect to Kontena Platform Master via SSH](#connect-to-kontena-platform-master-via-ssh)
* [Hints, Tips and Best Practices](#hints-tips-and-best-practices)

## Install Kontena Platform Master

Kontena Platform Master software is designed to handle multiple Kontena Platform Grids. Since Kontena Platform (the isolated environment for running the container workloads) is combination of a Master and a Grid, most organizations are good with just one Kontena Platform Master installation.

Please note, each Kontena Platform Grid must be assigned a dedicated set of Kontena Nodes. Kontena Platform Master does not provide any compute resources for the Kontena Platform Grid.

Please see the [Install Kontena Platform Master](install-master/README.md) documentation to learn more.

## List Kontena Platform Masters

```
$ kontena master list
```

## Remove Kontena Platform Master

```
$ kontena master remove
```

## Configure Kontena Platform Master

```
$ kontena master config
```

## Switch Current Kontena Platform Master

```
$ kontena master use
```

## Show Current Kontena Platform Master Details

```
$ kontena master current
```

## Login to Kontena Platform Master

```
$ kontena master login
```

## Logout from Kontena Platform Master

```
$ kontena master logout
```

## Manage Kontena Platform Master Access Tokens

```
$ kontena master token
```

## Join to Kontena Platform Master Using Invitation Code

```
$ kontena master join
```

## Show Kontena Platform Master Audit Log

```
$ kontena master audit-log
```

## Connect Kontena Platform Master to Kontena Cloud

```
$ kontena master init-cloud
```

## Connect to Kontena Platform Master via SSH

```
$ kontena master ssh
```

## Hints, Tips and Best Practices

#### Exporting Logs Directly from MongoDB

The Kontena Master is storing log data in a capped MongoDB collection, which limits the disk space usage by automatically removing older log entries. Some external log collection services allow importing log data directly from MongoDB. To gather logs from Kontena Platform Master database, you need to run the collector with an access to the database. Usually the MongoDB is not exposed to Internet, so consider running this log collector service alongside with the Kontena Platform Master database.

In the example below, you'll see FluentD configuration for shipping logs directly to Amazon AWS S3:

```
<source>
  type mongo_tail
  url "#{ENV['MONGODB_URL']}"
  collection container_logs
  tag_key name
  time_key created_at
  id_store_collection container_logs_tail
</source>

<match **>
  @type s3

  aws_key_id "#{ENV['S3_ACCESS_KEY']}"
  aws_sec_key "#{ENV['S3_SECRET_KEY']}"
  s3_bucket "#{ENV['S3_BUCKET']}"
  s3_region "#{ENV['S3_REGION']}"
  buffer_type memory
  buffer_chunk_limit 256m
  buffer_queue_limit 128
  path logs/

  format json
  include_time_key true
  include_tag_key true

  s3_object_key_format %{path}/ts=%{time_slice}/%{index}_json.%{file_extension}
  time_slice_format %Y%m%d-%H
  time_slice_wait 30m
  utc
</match>
```

#### Opt-Out Telemetry

To continuously improve the Kontena experience, the Kontena Platform Master reports anonymous usage data to Kontena, Inc. This data is used to monitor the reliability of Kontena internal components and installations and to find out which features are most popular. This telemetry data is very helpful to us, so we hope that you will leave it enabled. The telemetry may be disabled through setting the Kontena Platform Master `server.telemetry_enabled` configuration to `false`. Using Kontena CLI tool:

```
$ kontena master config set server.telemetry_enabled=false
```
