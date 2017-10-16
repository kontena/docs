# Creating Kontena Nodes on Ubuntu

* [Prerequisites](#prerequisites)
* [Create Kontena Node](#install-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)

## Prerequisites

* [Kontena CLI](/tools/cli.md)
* Some machine(s) with Ubuntu Xenial (16.04) or Ubuntu Trusty (14.04) operating system

## Create Kontena Node

#### Step 1. Install Docker Engine

Kontena requires [Docker Engine](https://docs.docker.com/engine/) to be installed on every host.

The `kontena-agent` packages are compatible with Docker 1.12 and later versions. They have been tested with the following package variants and versions:

* `docker.io` `1.12.6`
* `docker-engine` `1.12.6` - `17.05.0`
* `docker-ce` `1.12.6` - `17.06.0`



Installing Docker Engine on **Ubuntu Xenial (16.04)**:

```
$ sudo apt install docker.io=1.12*
```

Installing Docker Engine on **Ubuntu Trusty (14.04)**:

```
$ sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
$ echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" | sudo tee -a /etc/apt/sources.list.d/docker.list
$ sudo apt-get update
$ sudo apt-get install apt-transport-https ca-certificates linux-image-extra-$(uname -r) linux-image-extra-virtual
$ sudo apt-get install docker-engine=1.12.*
```

#### Step 2. Install Kontena Node Software

Installing Kontena Node software on **Ubuntu Xenial (16.04)**

```
$ wget -qO - https://bintray.com/user/downloadSubjectPublicKey?username=bintray | sudo apt-key add -
$ echo "deb http://dl.bintray.com/kontena/ubuntu xenial main" | sudo tee /etc/apt/sources.list.d/kontena.list
$ sudo apt-get update
$ sudo apt-get install kontena-agent
```

Installing Kontena Node software on **Ubuntu Trusty (14.04)**

```
$ wget -qO - https://bintray.com/user/downloadSubjectPublicKey?username=bintray | sudo apt-key add -
$ echo "deb http://dl.bintray.com/kontena/ubuntu trusty main" | sudo tee /etc/apt/sources.list.d/kontena.list
$ sudo apt-get update
$ sudo apt-get install kontena-agent
```

At the end of the installation the process, you will be asked for a couple of configuration parameters:

* `KONTENA_URI` - Specify the URI of the Kontena Platform (use ws:// for a non-tls connection) you want to use. Use `kontena cloud platform env` to see the current Kontena Platform URI.
* `KONTENA_TOKEN` - Specify the token of the Kontena Platform. Use `kontena cloud platform env` to see the current Kontena Platform token.

## Restart Kontena Node

Not supported via Kontena CLI tool.

## Terminate Kontena Node

Not supported via Kontena CLI tool.

## Update Kontena Node

Kontena Master and Kontena Node versions must match at least on `major.minor` versions, although it's recommended to keep versions exactly in sync.

Kontena Nodes can be updated via `apt-get`:

```
$ sudo apt-get update
$ sudo apt-get upgrade
```

## Advanced Usage

No more advanced usage available :)
