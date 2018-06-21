# Installing Kontena Platform Master on Ubuntu

## Prerequisites

* [Kontena CLI](/tools/cli.md)

## Install Docker Engine


 The `kontena-server` packages are compatible with Docker 1.12 and later versions. They have been tested with the following package variants and versions:

 * `docker.io` `1.12.6`
 * `docker-engine` `1.12.6` - `17.05.0`
 * `docker-ce` `1.12.6` - `17.06.0`


#### Ubuntu Xenial (16.04)

```
$ sudo apt install docker.io=1.12*
```

#### Ubuntu Trusty (14.04)

```
$ sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
$ echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" | sudo tee -a /etc/apt/sources.list.d/docker.list
$ sudo apt-get update
$ sudo apt-get install apt-transport-https ca-certificates linux-image-extra-$(uname -r) linux-image-extra-virtual
$ sudo apt-get install docker-engine=1.12.*
```

## Install Kontena Platform Master

#### Ubuntu Xenial (16.04)

```
$ wget -qO - https://bintray.com/user/downloadSubjectPublicKey?username=bintray | sudo apt-key add -
$ echo "deb http://dl.bintray.com/kontena/ubuntu xenial main" | sudo tee /etc/apt/sources.list.d/kontena.list
$ sudo apt-get update
$ sudo apt-get install kontena-server
```

#### Ubuntu Trusty (14.04)

```
$ wget -qO - https://bintray.com/user/downloadSubjectPublicKey?username=bintray | sudo apt-key add -
$ echo "deb http://dl.bintray.com/kontena/ubuntu trusty main" | sudo tee /etc/apt/sources.list.d/kontena.list
$ sudo apt-get update
$ sudo apt-get install kontena-server
```

At the end of the installation process, you are asked for an initial admin code for the Kontena Platform Master. This is used to authenticate the initial admin connection of Kontena CLI in order to configure the Kontena Platform Master properly. The code can be any random string.

If using automation the value can be overwritten in the file `/etc/default/kontena-server-api` on Ubuntu Trusty or `/etc/kontena-server.env` on Ubuntu Xenial.

## Setup SSL Certificate

#### Ubuntu Xenial (16.04)

```
$ sudo vim /etc/kontena-server.env

# HAProxy SSL certificate
SSL_CERT=/path/to/certificate.pem

$ sudo systemctl restart kontena-server-haproxy
```

#### Ubuntu Trusty (14.04)

```
$ sudo stop kontena-server-haproxy
$ sudo vim /etc/default/kontena-server-haproxy

# HAProxy SSL certificate
SSL_CERT=/path/to/certificate.pem

$ sudo start kontena-server-haproxy
```

## Login to Kontena Platform Master

After the Kontena Platform Master has started, you can authenticate as local administrator using the `KONTENA_INITIAL_ADMIN_CODE`. Please refer to [authentication](../authentication.md) for information about how to log in with the admin code and how to configure [Kontena Cloud](https://cloud.kontena.io) as the authentication provider.

## Updating Kontena Platform Master

Kontena Platform Master can be updated via `apt-get`.

```
$ sudo apt-get update
$ sudo apt-get upgrade
```

**NOTE!** Kontena Platform Master and Agent versions must match at least on `major.minor` versions, although it's recommended to keep versions exactly in sync.
