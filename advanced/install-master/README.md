# Installing Kontena Platform Master

> Kontena Cloud users do not need to install Kontena Platform Master. This article is for those who want to tinker and run their own custom Kontena Platform Master.

The [Kontena Platform Master](../../using-kontena/README.md#kontena-platform-master) may be installed on _any_ Linux machine. The easiest way, is to use Kontena CLI built-in provision tool that is designed to help Kontena Platform Master installation. See below instructions for installing Kontena Platform Master on various platforms:

* [AWS EC2](aws-ec2.md) (via plugin)
* [Azure](azure.md) (via plugin)
* [Container Linux](container-linux.md)
* [DigitalOcean](digitalocean.md) (via plugin)
* [Docker Compose](docker-compose.md)
* [Packet](packet.md) (via plugin)
* [Ubuntu](ubuntu.md)
* [UpCloud](upcloud.md) (via plugin)
* [Vagrant](vagrant.md) (via plugin)

## System Requirements

Any Linux machine that is able to run Docker 1.9.x - 1.12.x.

## Needed open ports

To operate properly Kontena Platform Master needs only a few ports opened. If you are using Kontena CLI Plugins, those ports should be opened automatically for you. If you are making a custom install, please make sure you have the following ports open:

* **443** - Kontena Nodes will connect using this port. If for some reason you are using insecure http connection, use port 80.
* **22** - For possible SSH connections

## High Availability Setup

Kontena Platform Master can be run in high availability setup where multiple instances of the Kontena Platform Masters work together to provide fault tolerant system suitable for mission critical services.

### Requirements for High Availability Setup

For HA setup, it is recommended to have 2+ dedicated machines from different availability zones running Kontena Platform Master software. Those machines should be operating with any modern Linux distribution with support for Docker and docker-compose. CoreOS and Ubuntu are recommended. 

Kontena Platform Master requires MongoDB. For HA setup, it is recommended to have 3+ dedicated machines from different availability zones running MongoDB replica-set.

**Note:** Using managed services like compose.io can give huge operational benefits with some additional costs. If you choose to use one of the managed database services, it is recommended to run the database in the same data center with your Kontena Platform Master. If not, there might be severe latency that could cause problems.

### Running Kontena Platform Master Instances

Kontena Platform Master is run just like with single system setup. The only difference is that all the Kontena Platform Master instances should point to the same database cluster and use the same configuration for all those Kontena Platform Master instances.

For example, if you are setting up Kontena Platform Master using docker-compose you can use following configuration:

```yaml
version: '2'
services:
  master:
    image: kontena/server:1.3
    container_name: kontena-server-api
    restart: unless-stopped
    environment:
      - RACK_ENV=production
      - MONGODB_URI=mongodb://<user>:<password>@mongodb-1:10481,mongodb-2:10481/kontena-master?replicaSet=kontena-master
      - VAULT_KEY=somerandomverylongstringthathasatleastsixtyfourchars
      - VAULT_IV=somerandomverylongstringthathasatleastsixtyfourchars
      - INITIAL_ADMIN_CODE=loginwiththiscodetomaster
    ports:
      - 80:9292
```

With the above configuration, you can spin up as many instances you want in your HA setup. Usually two or three instances are enough. Just make sure all the instances are using same environment variables.

**Note** The example above uses version 1.3 (which translates to latest patch release on 1.3.x). You can also use tag `latest` but that might cause un-expected upgrades as `latest` always points to latest stable release.

### Provisioning Kontena Platform Master Instances with Kontena CLI

Kontena CLI built-in provision tool may be used to provision Kontena Platform Master instances. For HA setup, it is required to set the `--mongodb-uri` option. For example:

```bash
$ kontena aws master create --mongodb-uri mongodb://<user>:<password>@mongodb-1:10481,mongodb-2:10481/kontena-master?replicaSet=kontena-master
```

### Load Balancing for HA Setup

Since Kontena CLI and Kontena Nodes connect to the Kontena master using http(s) protocol, there should be a load balancer distributing the connections to different Kontena Platform Master instances. SSL termination should be enabled on the load balancer since the Kontena Platform Master accepts only plain HTTP traffic. 

The recommended way to perform load balancing is to use cloud provider solutions such as ELB/ALB. If this is not possible, it is possible to setup some custom load balancer in front (e.g. nginx, caddy, traefik) or use Kontena HAProxy

### Connecting Kontena Nodes to Kontena Platform Master Instances

In HA setup, All Kontena Nodes should connect to Kontena Platform Master instances via load balancer. Therefore, each Kontena Node must be configured with the Kontena Platform Master load balancer address:

```
KONTENA_URI=wss://<LOAD_BALANCER_ADDRESS>
```

### Additional Remarks About HA Setup

Kontena Platform Master instances will use the provided MongoDB replica-set to elect a leader in the HA cluster. This leader will coordinate re-scheduling and all communication to Kontena Cloud (in case Kontena Cloud is used).
