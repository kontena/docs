# Cheat Sheet

## Working with stacks and services

    # Stop all services
    $ kontena service ls -q | xargs -L1 kontena service stop --force

    # Connecting to a specific instance
    $ kontena service exec --instance NUM servicename

## Working with kontena components

    # See the kontena/lb config
    $ kontena service exec ingress-lb/lb cat /etc/haproxy/haproxy.cfg

## Administrative tasks

    # Restart first 3 agents
    $ for i in `seq 1 3`; do kontena container exec -it node-$i.grid.net/kontena-agent kill 1; done

    # Check etcd health
    $ kontena container exec nodename/kontena-etcd etcdctl cluster-health