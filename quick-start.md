# Quick Start

The average time for Kontena users to get from zero to hero is just under 20 minutes! Let's assume you have already created some amazing application and packaged is as docker containers, here's what it takes to get from zero to hero with Kontena:

1. Install Kontena CLI tool.
2. Create a [Kontena Platform](using-kontena/platform.md).
3. Install [Kontena Nodes](using-kontena/nodes.md).
4. Deploy first [Kontena Stack](using-kontena/stacks.md).

Follow these steps to get started with Kontena on Kontena Cloud quickly. If you like to tinker and maintain the Kontena Platform yourself, please follow the [slow start](./slow-start.md) guide.

## Step 1. Install Kontena CLI (command-line interface)

### MacOS (OSX)

You can install Kontena CLI using our [official installer](https://github.com/kontena/kontena/releases/latest).

### Linux / Windows

> Prerequisites: You'll need Ruby version 2.1 or later installed on your system. For more details, see the official [Ruby installation docs](https://www.ruby-lang.org/en/documentation/installation/).

You can install the Kontena CLI using the Rubygems package manager (which is included in Ruby).

```
$ gem install kontena-cli
```

After the installation is complete, you can test the installation by checking the Kontena CLI version with `kontena version`.

## Step 2. Create a Kontena Platform

The easiest (and preferred) way to provision Kontena Platform Master is to use the built-in Kontena Cloud Platform provision feature of Kontena CLI. In this guide, we will provision Kontena Platform to Kontena Cloud and nodes to the local development environment using [Vagrant](https://www.vagrantup.com/). If you want to install nodes to some other environment, please see [Installing Kontena](using-kontena/install-nodes/) documentation.

Since we will be using Vagrant, please ensure you have Vagrant 1.6 or later installed. For more details, see the official [Vagrant installation docs](https://docs.vagrantup.com/v2/installation/index.html).

After Vagrant is installed, you can install required plugins to Kontena CLI.

```
$ kontena plugin install cloud
$ kontena plugin install vagrant
```

Before you can create a Kontena Cloud Platform you need to login:

```
$ kontena cloud login
```

After login is completed succesfully you can start Kontena Platform provisioning with following command:

```
$ kontena cloud platform create quick-start
> This will create managed platform to Kontena Cloud, proceed? Yes
> Choose organization: my-username (you)
> Choose region: EU West
> Initial platform size (number of nodes): 1 (dev/test)
 [done] Creating platform quick-start to region eu-west-1
 [done] Waiting for platform quick-start to come online
 [done] Switching to use platform my-username/quick-start
```

During the installation process you will have the option to select region where Kontena Platform is provisioned. It's recommended to select closest region for you to minimize latency between your local development environment and Kontena Platform.

## Step 3. Install Kontena Nodes

You'll need some Kontena Nodes to run your containerized workloads. If you don't have existing Kontena infrastructure in place, you'll need to install your own.

As with with Kontena Platform, the easiest (and preferred) way to provision Kontena Nodes is to use the built-in Kontena Node provisioning feature of Kontena CLI. In this guide, we will provision Kontena Nodes to the local development environment using [Vagrant](https://www.vagrantup.com/). If you want to install Kontena Nodes to some other environment, please see the [Installing Kontena Nodes](installing/nodes.md) documentation.

Since we will be using Vagrant, please ensure you have Vagrant installed. For more details, see official [Vagrant installation docs](https://docs.vagrantup.com/v2/installation/index.html).


Install a node to the platform you created in the previous chapter:

```
$ kontena vagrant node create
> How many nodes?:  1
> Choose a size  1024MB
 [done] Generating Vagrant config
 [done] Triggering CoreOS Container Linux box update
...
 [done] Executing 'vagrant up'
...
 [done] 'vagrant up' executed successfully
 [done] Waiting for node damp-forest-2 to join grid quick-start
```

You can repeat this step to provision additional Kontena Nodes to your Kontena Platform.

**Note!** While Kontena will work with just a single Kontena Node, it is recommended to have at least three Kontena Nodes provisioned in a Grid.

If you followed the steps above, you should now have a working Kontena setup installed. Verify the setup using the `kontena node list` command. It should list all the Kontena Nodes in your Grid.

```
$ kontena node list
NAME              VERSION   STATUS   INITIAL   LABELS
⊛ damp-forest-2   1.3.4     online   1 / 1     provider=vagrant
```

## Step 4. Deploy Your First Application Stack

 Now you are ready to deploy your first application stack.
 In this section we will show you how to package a simple WordPress application and deploy it to your Kontena Grid.

First create the `kontena.yml` file with the following contents:

```yaml
stack: examples/wordpress
version: 0.3.0
variables:
  wordpress-mysql-root:
    type: string
    from:
      vault: wordpress-mysql-root
      random_string: 32
    to:
      vault: wordpress-mysql-root
  wordpress-mysql-password:
    type: string
    from:
      vault: wordpress-mysql-password
      random_string: 32
    to:
      vault: wordpress-mysql-password
services:
  wordpress:
    image: wordpress:4.6
    stateful: true
    ports:
      - 80:80
    environment:
      WORDPRESS_DB_HOST: mysql
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_NAME: wordpress
    secrets:
      - secret: wordpress-mysql-password
        name: WORDPRESS_DB_PASSWORD
        type: env
  mysql:
    image: mariadb:5.5
    stateful: true
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
    secrets:
      - secret: wordpress-mysql-root
        name: MYSQL_ROOT_PASSWORD
        type: env
      - secret: wordpress-mysql-password
        name: MYSQL_PASSWORD
        type: env
```

You can then install and deploy the `wordpress` stack:

```
$ kontena stack install kontena.yml
 [done] Creating stack wordpress
 [done] Deploying stack wordpress
```

The initial stack deployment may take some time while the host nodes pull the referenced Docker images.

After the stack deployment is finished you can verify that the wordpress and mysql services are running:

```
$ kontena stack ls
NAME                                                         VERSION    SERVICES   STATE      EXPOSED PORTS
⊝ wordpress                                                  0.3.0      2          running    *:80->80/tcp
```

You can use the `kontena service` commands to view the resulting configuration of each deployed stack service:

```
$ kontena service show wordpress/wordpress
test/wordpress/wordpress:
  stack: test/wordpress
  status: running
  image: wordpress:4.6
  revision: 2
  stateful: yes
  scaling: 1
  strategy: ha
  deploy_opts:
    min_health: 0.8
  dns: wordpress.wordpress.test.kontena.local
  secrets:
    - secret: wordpress-mysql-password
      name: WORDPRESS_DB_PASSWORD
      type: env
  env:
    - WORDPRESS_DB_HOST=mysql
    - WORDPRESS_DB_USER=wordpress
    - WORDPRESS_DB_NAME=wordpress
  net: bridge
  ports:
    - 80:80/tcp
  instances:
    wordpress-wordpress-1:
      rev: 2016-11-28 13:51:02 UTC
      service_rev: 2
      node: hidden-moon-99
      dns: wordpress-1.wordpress.test.kontena.local
      ip: 10.81.128.115
      public ip: 192.0.2.1
      status: running
      exit code: 0
```

To test the wordpress service, you must connect to the IP address of the host node publishing the wordpress service on TCP port 80.
You can use the public IP address of the host node running the service instance displayed as part of the `kontena service show` output.
**Note:** For the special case of using Vagrant for the Kontena setup, you must use the *private* IP address of the node running the `wordpress/wordpress` service: `kontena node show hidden-moon-99 | grep 'private ip'`.

Please see the following examples for more advanced stacks:

- [PostgreSQL Cluster (stolon)](https://github.com/kontena/kontena-stacks/tree/master/stolon)
- [Kong API Gateway](https://github.com/kontena/kontena-stacks/tree/master/kong)
- [Wordpress Cluster](https://github.com/kontena/kontena-stacks/tree/master/wordpress-cluster)

## Congratulations -- Enjoy!

This completes the quick start guide for setting up Kontena. For further learning, you can continue by reading the following:

* [Kontena Platform Overview](using-kontena/README.md)
* [Platform](using-kontena/platform.md)
* [Stacks](using-kontena/stacks.md)
* [Secrets Management](using-kontena/vault.md)
* [Loadbalancer](using-kontena/loadbalancer.md)

We hope you will find this documentation helpful! If you have any suggestions on improving our documentation, please [open an issue](https://github.com/kontena/kontena/issues) on GitHub.
