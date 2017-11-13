# Quick start with Kontena CLI

The average time for Kontena users to get from zero to hero is just under 20 minutes! Let's assume you have already created some amazing application and packaged is as docker containers, here's what it takes to get from zero to hero with Kontena:

1. Install Kontena CLI tool.
2. Create a [Kontena Platform](using-kontena/platform.md).
3. Install [Kontena Nodes](using-kontena/nodes.md).
4. Deploy first [Kontena Stack](using-kontena/stacks.md).

Follow these steps to get started with Kontena on Kontena Cloud quickly. If you'd like to tinker and maintain the Kontena Platform yourself, please follow the [slow start](./slow-start.md) guide.

## Step 1. Install Kontena CLI (command-line interface)

### MacOS (OSX)

You can install Kontena CLI using our [official installer](https://gh-releases.kontena.io/kontena/kontena/pkg/latest) or [Homebrew](https://brew.sh/) :

```
$ brew install kontena
```

### Debian / Ubuntu

You can install Kontena CLI using our [official deb package](https://gh-releases.kontena.io/kontena/kontena/deb/latest).

### Linux / Windows

> Prerequisites: You'll need Ruby version 2.1 or later installed on your system. For more details, see the official [Ruby installation docs](https://www.ruby-lang.org/en/documentation/installation/).

You can install the Kontena CLI using the Rubygems package manager (which is included in Ruby).

```
$ gem install kontena-cli
```

After the installation is complete, you can test the installation by checking the Kontena CLI version with `kontena version`.

## Step 2. Create a Kontena Platform

The easiest (and preferred) way to provision Kontena Platform is to use the built-in Kontena Cloud Platform provision feature of Kontena CLI.

Before you can create a Kontena Cloud Platform you need to login:

```
$ kontena cloud login
```

After the login is completed succesfully you can start Kontena Platform provisioning with following command:

```
$ kontena cloud platform create quick-start
> This will create managed platform to Kontena Cloud, proceed? Yes
> Choose organization: my-username
> Platform type: mini (non-business critical services)
 [done] Creating platform quick-start
 [done] Waiting for platform quick-start to come online
 [done] Switching to use platform my-username/quick-start

 Platform quick-start needs at least 1 node(s) to be functional.
  You can add nodes from Kontena Cloud ('kontena cloud node create --count 1') or you can bring your own nodes (https://www.kontena.io/docs/using-kontena/install-nodes/).
```

## Step 3. Install Kontena Nodes

You'll need some Kontena Nodes to run your containerized workloads. The easiest way to provision Kontena Nodes is to use the built-in Kontena Cloud Node provision feature of Kontena CLI. In this guide, we will provision Kontena Nodes to Kontena Cloud. If you want to install nodes to some other environment, please see [Installing Kontena](using-kontena/install-nodes/) documentation.

Install a node to the platform you created in the previous chapter:

```
$ kontena cloud node create
> Choose node type: K4
> How many nodes?:  1
 [done] Provisioning a node damp-forest-2 to platform quick-start, region eu-west-1
```

You can repeat this step to provision additional Kontena Nodes to your Kontena Platform.

**Note!** While Kontena will work with just a single Kontena Node, it is recommended to have at least three Kontena Nodes provisioned in a Grid.

If you followed the steps above, you should now have a working Kontena setup installed. Verify the setup using the `kontena node list` command. It should list all the Kontena Nodes in your Grid.

```
$ kontena node list
NAME              VERSION   STATUS       INITIAL   LABELS
⊛ damp-forest-2   1.4.0     online 11s   1 / 1     region=eu-west-1,az=a,provider=kontena
```

## Step 4. Deploy Your First Application Stack

 When the provisioned node is online, you are ready to deploy your first application stack.
 In this section we will show you how to package a simple WordPress application and deploy it to your Kontena Platform.

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
You can use the public IP address of the host node running the service instance displayed as part of the `kontena service show wordpress/wordpress` output.

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
