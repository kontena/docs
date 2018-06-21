# Quick Start

The average time for Kontena Classic users to get from zero to hero is just under 20 minutes! Let's assume you have already created some amazing application and packaged it as docker containers, here's what it takes to get from zero to hero with Kontena Classic:

1. Install Kontena CLI (command-line interface).
2. Install a [Kontena Platform Master](using-kontena/platform.md).
4. Install [Kontena Platform Nodes](using-kontena/nodes.md).
5. Deploy first [Kontena Stack](using-kontena/stacks.md).

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


You can install the Kontena CLI using the Rubygems package manager, which is included in Ruby.

```
$ gem install kontena-cli
```

**OPTIONAL**

To enable tab-completion for bash, add the following to your `.bashrc` scripts:

```
which kontena > /dev/null && . "$( kontena whoami --bash-completion-path )"
```

## Step 2. Install Kontena Master

In order to use Kontena Classic, you'll need a Kontena Master. If you don't have an existing Kontena Classic infrastructure in place, you need to install one. A Kontena Master can be provisioned for any cloud platform. It' s also possible to run a Kontena Master on your own local development environment for testing purposes.

The easiest (and preferred) way to provision Kontena Master is to use the built-in Kontena Master provision feature of Kontena CLI. In this guide, we will provision Kontena Master to the local development environment using [Vagrant](https://www.vagrantup.com/).

Since we will be using Vagrant, please ensure you have Vagrant 1.6 or later installed. For more details, see the official [Vagrant installation docs](https://docs.vagrantup.com/v2/installation/index.html).

```
$ kontena plugin install vagrant
$ kontena vagrant master create
```

During the Kontena Platform Master installation process, you will have to choose how users will be authenticated. The default option is to use Kontena Cloud as the authentication provider, but it is possible to use any OAuth2 authentication provider. Learn more about the [Kontena Platform Master authentication](./advanced/authentication.md).

## Step 3. Install Kontena Nodes

You'll need some Kontena Nodes to run your containerized workloads. As with with Kontena Master, the easiest (and preferred) way to provision Kontena Nodes is to use the built-in Kontena Node provisioning feature of Kontena CLI. In this guide, we will provision Kontena Nodes to the local development environment using [Vagrant](https://www.vagrantup.com/). If you want to install Kontena Nodes to some other environment, please see the [Installing Kontena Nodes](using-kontena/install-nodes/README.md) documentation.

Since we will be using Vagrant, please ensure you have Vagrant installed. For more details, see official [Vagrant installation docs](https://docs.vagrantup.com/v2/installation/index.html).

Nodes always belong to a Grid. An initial Grid called 'test' has been created during Kontena Master installation. If you want to create or switch to another Grid, you can do it by using:

```
$ kontena grid create testing
# or to switch to an existing grid, use:
$ kontena grid use testing
```

Install a node in the currently selected Grid:

```
$ kontena vagrant node create
Creating Vagrant machine kontena-node-broken-butterfly-72... done
Waiting for node kontena-node-broken-butterfly-72 join to grid test... done
```

You can repeat this step to provision additional Kontena Nodes to your Grid.

**Note!** While Kontena will work with just a single Kontena Node, it is recommended to have at least two Kontena Nodes provisioned in a Grid.

If you followed the steps above, you should now have a working Kontena setup installed. Verify the setup using the `kontena node list` command. It should list all the Kontena Nodes in your Grid.

```
$ kontena node list
```

## Step 5. Deploy Your First Application Stack

After the provisioned node is online, you are ready to deploy your first application stack. To install a ready-made stack you can execute `stack install kontena/hello-world` command in terminal.

The initial stack deployment may take some time while the host nodes pull the referenced Docker images.

After the stack deployment is finished you can verify from the Kontena Cloud Dashboard that the lb and web services are running or executing the `stack ls` command:

```
> stack ls
NAME            STACK                       SERVICES   STATE     EXPOSED PORTS
⊛ hello-world   kontena/hello-world:1.0.0   2          running   *:80->80/tcp
```

Typically, to test the installed stack, you must connect to the IP address of the host node publishing the `lb` service on TCP port 80. You can use the public IP address of the host node running the service instance displayed as part of the kontena service show output `service show hello-world/lb`:

```
> service show hello-world/lb
   ...
   hello-world/lb/1:
      scheduled_to: kontena-node-broken-butterfly-72
      deploy_rev: 2017-11-10 08:11:10 UTC
      rev: 2017-11-10 08:11:10 UTC
      state: running
      containers:
        hello-world.lb-1 (on kontena-node-broken-butterfly-72):
          dns: lb-1.hello-world.test.kontena.local
          ip: 10.81.128.41
          public ip: 18.194.195.204
          status: running
```

**Note:** For the special case of using Vagrant for the Kontena Classic setup, you must use the *private* IP address of the node running the `hello-world/lb` service: `kontena node show kontena-node-broken-butterfly-72 | grep 'private ip'`.

## Congratulations -- Enjoy!

This completes the quick start guide for setting up Kontena Classic environment. For further learning, you can continue by reading the following:

* [Kontena Platform Overview](using-kontena/README.md)
* [Platform](using-kontena/platform.md)
* [Stacks](using-kontena/stacks.md)
* [Secrets Management](using-kontena/vault.md)
* [Loadbalancer](using-kontena/loadbalancer.md)

## Advanced

### Install Kontena Platform Master to other environments
If you want to install Kontena Master to some other environment, please see [Installing Kontena](using-kontena/install-master/README.md) documentation.

We hope you will find this documentation helpful! If you have any suggestions on improving our documentation, please [open an issue](https://github.com/kontena/kontena/issues) on GitHub.
