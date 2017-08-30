# Using Kontena Platform Statistics

[Kontena Platform Statistics](./README.md#kontena-platform-statistics) enables real-time access to the most recent statistics. In addition to real-time access, Kontena Platform Statistics may be forwarded to a third party statistics collection service.

In this chapter, we'll discover how to access Kontena Platform Statistics and how to configure an external statistics collection service:

* [Inspecting Kontena Service Statistics](#inspecting-kontena-service-statistics)
* [Configuring External Stats Collection Service](#configuring-external-stats-collection-service)

## Inspecting Kontena Service Statistics

The command that may be used for inspecting the statistics of a single Kontena Service.

```
$ kontena service stats <SERVICE_NAME>
```

## Configuring An External Stats Collection Service

While the Kontena CLI may be used to display the current statistics of selected Kontena Services, users may want to see long-term trends. For that purpose, Kontena Platform may export all stats in real time using the [StatsD protocol](https://github.com/b/statsd_spec).

Statistics exporting can be enabled through the Kontena Platform Grid configuration.

```
$ kontena grid update --statsd-server influx.example.com:8125 <GRID_NAME>
```

To disable stats exporting use:

```
$ kontena grid update --no-statsd-server <GRID_NAME>
```

It is completely up to the user to select which systems to use to collect and view statistics. The only requirement is that the selected system be able to collect statistics via the StatsD protocol. Some systems that you might consider:

* [InfluxData](https://www.influxdata.com/time-series-platform/) - using Telegraf [StatsD plugin](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/statsd#telegraf-service-plugin-statsd)
* [Prometheus](https://prometheus.io/) - using [StatsD exporter](https://github.com/prometheus/statsd_exporter)
* [Datadog](https://www.datadoghq.com/) - using [DogStatsD](https://docs.datadoghq.com/guides/dogstatsd/)
* [Sysdig](https://sysdig.com/) - using [StatsD metrics integration](https://support.sysdig.com/hc/en-us/articles/204376099-Metrics-integrations-StatsD)
* Others? Let us know!

