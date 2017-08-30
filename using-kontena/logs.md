# Using Kontena Platform Logs

[Kontena Platform Logs](./README.md#kontena-platform-logs) enable real-time access to log streams. In addition to real-time access, Kontena Platform Logs may be forwarded to a third party log collection service.

In this chapter, we'll discover how to access Kontena Platform Logs and how to configure the external log collection service:

* [Inspecting logs in real time](#inspecting-logs-in-real-time)
* [Configuring external log collection service](#configuring-external-log-collection-service)
  * [For Entire Kontena Platform](#for-entire-kontena-platform)
  * [For Selected Kontena Services](#for-selected-kontena-services)
* [FluentD Log Forwarding Details](#fluentd-log-forwarding-details)

## Inspecting Logs in Real Time

You can inspect logs using the Kontena CLI or Kontena Cloud. With the Kontena CLI tool:

Inspect logs from a single container:

```
$ kontena container logs <NODE_NAME>/<CONTAINER_NAME>
```

Inspect logs from a single Kontena Service:

```
$ kontena service logs <SERVICE_NAME>
```

Inspect logs from a single Kontena Stack:

```
$ kontena stack logs <STACK_NAME>
```

Inspect logs from an entire Kontena Platform:

```
$ kontena grid logs
```

## Configuring External Log Collection Service

For some users and use cases, there is the need to further process the logs in order to gather some relevant statistics and insight what is happening in the system. For such needs, Kontena Platform may be configured to stream log data to an external log collection service.

#### For Your Entire Kontena Platform

The external log collection service may be enabled and configured for your entire Kontena Platform. This configuration is done via [Kontena Platform configuration settings](./platform.md). Once enabled, all the logs are automatically sent to an external log collection service.

#### For Selected Kontena Services

The external log collection service may be enabled selectively for just some of the Kontena Services. This configuration is done via the [Kontena Stack File](./stack-file.md) `log-driver` option. Once enabled, logs from these selected Kontena Services are automatically sent to an external log collection service. This is recommended for environments where lots of logs are being generated to avoid Kontena Platform becoming unresponsive.

**IMPORTANT!** If enabled, logs from these Kontena Services are not available for real-time inspection or Kontena Platform level forwarding.

See below for an example. Also check Docker log [documentation](https://docs.docker.com/engine/admin/logging/overview/#/supported-logging-drivers) for details on supported drivers and their options.

```yaml
logging:
  driver: syslog
  options:
    syslog-address: "tcp://192.168.0.42:123"
```

```yaml
 nginx:
   image: nginx:latest
   ports:
     - 80:80
   logging:
     driver: fluentd
     options:
       fluentd-address: 192.168.99.1:24224
       # {% raw %}
       # raw .. endraw needed to avoid parsing {{ .. }} as a Liquid tag.
       fluentd-tag: docker.{{.Name}}
       # {% endraw %}
 ```

## FluentD Log Forwarding Details

Kontena Platform may be configured to send all logs to an external FluentD log collection service. Here are the details of the tags and data structure.

Each event sent to Fluentd is tagged with the following notation:

```
node.grid.stack.service.instance
```

Kontena Platform system containers (such as kontena-agent, ipam-plugin, weave, etc.) will be tagged like:

```
node.grid.system.service
```

The record itself is a hash with the following semantics:

```
{
  log: <log data>,
  type: stdout / stderr
}
```
