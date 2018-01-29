# Install Kontena Platform

> NOTE! This documentation is for those who want to use the Kontena open source project to deploy custom Kontena Platform. Use of Kontena Cloud is optional. If you don't want to tinker and maintain Kontena Platform yourself, please see [quick start](./quick-start.md) documentation instead.

## Step 1. Install Kontena CLI (command-line interface)

### MacOS (OSX)

You can install Kontena CLI using our [official installer](https://gh-releases.kontena.io/kontena/kontena/pkg/latest) or [Homebrew](https://brew.sh/) :

```
$ brew install kontena
```

### Linux / Windows

> Prerequisites: You'll need Ruby version 2.1 or later installed on your system. For more details, see the official [Ruby installation docs](https://www.ruby-lang.org/en/documentation/installation/).

You can install the Kontena CLI using the Rubygems package manager (which is included in Ruby).

```
$ gem install kontena-cli
```

After the installation is complete, you can test the installation by checking the Kontena CLI version with `kontena version`.

**OPTIONAL**

To enable tab-completion for bash, add this to your `.bashrc` scripts:

```
which kontena > /dev/null && . "$( kontena whoami --bash-completion-path )"
```

## Step 2. Install Kontena Platform Master

In order to use Kontena, you'll need a Kontena Platform Master. A Kontena Platform Master may be provisioned on any cloud infrastructure. It's also possible to install Kontena Platform Master on your own machine for testing purposes.

During the Kontena Platform Master installation process, you will have to choose how users will be authenticated. While it is possible to use any OAuth2 authentication provider, we recommended using Kontena Cloud as the authentication provider. Learn more about the [Kontena Platform Master authentication](./advanced/authentication.md).

See [Kontena Platform Master installation instructions](./advanced/install-master/README.md).

## Step 3. Install Kontena Nodes

Once Kontena Platform Master is up and running, you'll need some Kontena Nodes to run your containerized workloads. Before Kontena Nodes may be added, Kontena Platform Grid must be defined. Each custom Kontena Platform Master installation comes with a pre-created Grid called 'test'. If you want to create or switch to another Grid, you can do it by using:

```
$ kontena grid create <NAME_OF_THE_GRID>

# or to switch to an existing grid, use:
$ kontena grid use <NAME_OF_THE_GRID>

# to list all the grids, type:
$ kontena grid list
```

Once you have Kontena Platform Grid setup, you can [add Kontena Nodes](./using-kontena/install-nodes/README.md).

If you followed the steps above, you should now have a working Kontena setup installed. Verify the setup using the `kontena node list` command. It should list all the Kontena Nodes in your Grid.

```
$ kontena node list
```

## Step 4. Deploy Your First Kontena Stack

Now you are ready to deploy your first Kontena Stack. In this section we will show you how to package a simple WordPress application and deploy it to your Kontena Platform.

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

You can use the `kontena stack` commands to view the resulting configuration of each deployed stack service:

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

## Congratulations -- Enjoy!

This completes the slow start guide for setting up Kontena. For further learning, you can continue by reading the following:

* [Kontena Platform Overview](using-kontena/README.md)
* [Platform](using-kontena/platform.md)
* [Stacks](using-kontena/stacks.md)
* [Secrets Management](using-kontena/vault.md)
* [Loadbalancer](using-kontena/loadbalancer.md)

We hope you will find this documentation helpful! If you have any suggestions on improving our documentation, please [open an issue](https://github.com/kontena/kontena/issues) on GitHub.
