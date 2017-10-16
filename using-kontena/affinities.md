---
title: Deployment Affinities
---
# Deployment Affinities

When creating services, you can direct the Node(s) to which the containers should be launched based on scheduling rules.

### Affinity

An affinity condition happens when Kontena is trying to find a field that matches (`==`) a given value. An anti-affinity condition happens when Kontena is trying to find a field that does not match (`!=`) a given value.

```yaml
affinity:
  - "<condition 1>"
  - "<condition N>"
```

Kontena has the ability to compare values against node name, node labels, service name and container name.

For example:

- `node==node-1` will match node with name `node-1`
- `node!=node-1` will match all nodes, except `node-1`
- `label==az=1a` will match all nodes with label `az=1a`
- `label!=az=1a` will match all nodes, except nodes with label `az=1a`
- `service==mysql` will match all nodes that have instance of service `mysql` deployed
- `service!=mysql` will match all nodes, except those that have instance of service `mysql` deployed
- `container==mysql.db-1` will match all nodes that have container `mysql.db-1`
- `container!=mysql.db-1` will match all nodes, except those that have container `mysql.db-1`

#### Soft Affinity

By default affinities are hard-enforced. If an affinity is not met, the service won't be scheduled. With soft affinity the scheduler tries to meet the rule. If rule is not met, the scheduler will discard the filter and schedule the service according to other filters / deployment strategy.

Soft affinities are expressed with `~`.

For example:

- `label==~az-1a` tries to match nodes with name `node-1`. Affinity is discarded if none of the nodes have matching name.
- `service!=~mysql` tries to match nodes which don't have instance of `mysql` service deployed. Affinity is discarded if all nodes have instance of `mysql` service deployed.
