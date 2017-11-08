# Using Kontena Load Balancer

[Kontena Load Balancer](./README.md#kontena-load-balancer) is the powerful and fully automated load balancer for any number of Kontena Stacks and Services.

In this chapter, we'll discover how to use Kontena Load Balancer:

* [Creating a Kontena Load Balancer](#creating-a-kontena-load-balancer)
* [Configuring Kontena Load Balancer](#creating-a-load-balancer)
* [Linking Kontena Services to Kontena Load Balancer](#linking-kontena-services-to-kontena-load-balancer)
* [Using Kontena Load Balancer for Basic Authentication](#using-kontena-load-balancer-for-basic-authentication)
* [Using Kontena Load Balancer for SSL Termination](#using-kontena-load-balancer-for-ssl-termination)
* [Various Configuration Examples](#various-configuration-examples)
* [Hints, Tips and Best Practices](#hints-tips-and-best-practices)

## Creating a Kontena Load Balancer

You can create one or more Kontena Load Balancers simply by adding a new Kontena Service that is using the image `kontena/lb` in your Kontena Stack File. In addition, you must specify the [ports](../references/stack-file.md#ports). Additional [configuration options](#configuring-kontena-load-balancer) for Kontena Load Balancer may be provided via Kontena Service [environment variables](../references/stack-file.md#environment-variables).

Here's an example of how to create a simple Kontena Load Balancer named `my_loadbalancer`:

```yaml
...
services:
  my_loadbalancer:
    image: kontena/lb:latest
    ports:
      - 80:80
...
```

**NOTE!** The Kontena Load Balancer does not do anything unless there are some Kontena Services linked to it. See [how to link Kontena Services to Kontena Load Balancer](#linking-kontena-services-to-kontena-load-balancer) to learn more.

## Configuring Kontena Load Balancer

Kontena Load Balancer is configured via its `environment` variables. Here's the list of supported configuration options:

* **`KONTENA_LB_HEALTH_URI`** - URI at which to enable the Kontena Load Balancer level health check endpoint. Returns `200 OK` when Kontena Load Balancer is functional.
* **`STATS_PASSWORD`** - The password for accessing Kontena Load Balancer statistics using HTTP Basic authentication. The default username is `stats` and the default password is 'secret'.
* **`SSL_CERTS`** - SSL certificates to be used. See more at [SSL Termination](loadbalancer.md#ssl-termination).
* **`KONTENA_LB_SSL_CIPHERS`** - SSL Cipher suite used by the load balancer when operating in SSL mode. See more at [SSL Ciphers](loadbalancer.md#configuringcustomsslciphers)
* **`KONTENA_LB_CUSTOM_SETTINGS`** - Custom settings; each line will be appended to `defaults` section in the HAProxy configuration file.
* **`KONTENA_LB_SSL_CIPHERS`** - By default Kontena Load Balancer is using [strong SSL cipher suite](https://github.com/kontena/kontena-loadbalancer/blob/master/confd/templates/haproxy.tmpl#L9). If you want to use a custom cipher suite, you can specify it here. E.g. `ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384`.

## Linking Kontena Services to Kontena Load Balancer

Any Kontena Service may be linked to Kontena Load Balancer simply by adding a `links` variable with the name of the Kontena Load Balancer. Load balancing options for this Kontena Service may be configured via `environment` variable. The only required configuration is the port that is attached to Kontena Load Balancer.

Here's a simple example of how to link a Kontena Service `web` to a Kontena Load Balancer named `my_loadbalancer`:

```yaml
...
services:
  my_loadbalancer:
    image: kontena/lb:latest
    ports:
      - 80:80
  web:
    image: nginx:latest
    environment:
      - KONTENA_LB_INTERNAL_PORT=80
    links:
      - internet_lb
...
```

You can also link to an external load balancer in a different stack, e.g. the `lb` service in the `ingress-lb` stack:

```yaml
links:
  - ingress-lb/lb
```

You can also use the [`service_link`](../references/stack-file-variables#service_link) variable resolver to dynamically prompt for an external LB service when installing the stack:

```yaml
variables:
  lb:
    type: string
    from:
      service_link:
      	hint: Choose a loadbalancer
      	image: kontena/lb
services:
  whoami:
    image: jwilder/whoami
    links:
      - $lb
    environment:
      - KONTENA_LB_MODE=http
      - KONTENA_LB_INTERNAL_PORT=8000
```

The full list of configuration options for Kontena Service load balancing:

* **`KONTENA_LB_INTERNAL_PORT`** - Specify a port that is attached to a load balancer (**required**)
* **`KONTENA_LB_MODE`** - Specify the load balancing mode. Possible values: `http` or `tcp`. Default: `http`.
* **`KONTENA_LB_BALANCE`** - Specify the load-balancing algorithm. Possible values: `roundrobin`, `source`, `leastconn`. Default: `roundrobin`.
* **`KONTENA_LB_EXTERNAL_PORT`** - Specify a port to which the load balancer will start to listen. This may be used only if `KONTENA_LB_MODE` is set to `tcp`.
* **`KONTENA_LB_VIRTUAL_HOSTS`** - Comma-separated list of virtual hosts. This may be used only if `KONTENA_LB_MODE` is set to `http`. Please note, if you would like to access your service through the VPN, you'll need to add that as a virtual host as well.
* **`KONTENA_LB_VIRTUAL_PATH`** - Specify a path that is used to match the request. This may be used only if `KONTENA_LB_MODE` is set to `http`. For example, if you set a value here for "/api", then any request to e.g. "/api/foo" is proxied to "/foo" in your application.
* **`KONTENA_LB_KEEP_VIRTUAL_PATH`** - If set to true, the virtual path will be kept in the request path. This may be used only if `KONTENA_LB_MODE` is set to `http`. Default: `false`.
* **`KONTENA_LB_COOKIE`** - Enables cookie-based session stickiness. With an empty value, it defaults to the load balancer-set cookie. Can be customized to use application cookies. See details at [HAProxy docs](https://cbonte.github.io/haproxy-dconv/configuration-1.5.html#4.2-cookie).
* **`KONTENA_LB_CUSTOM_SETTINGS`** - Extra settings; each line will be appended to either the related backend section or the listen session in the HAProxy configuration file.

## Using Kontena Load Balancer for Basic Authentication

Kontena Load Balancer supports automatic [basic authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) for load balanced services. The implementation is relying on [Kontena Vault](./vault.md) that is a secrets management solution built-in to Kontena Platform. To enable basic authentication for a given Kontena Service, use the following configuration:
```yaml
...
services:
  my_loadbalancer:
    image: kontena/lb:latest
    ports:
      - 80:80

  web:
    image: nginx:latest
    environment:
      - KONTENA_LB_INTERNAL_PORT=80
    links:
      - my_loadbalancer
    secrets:
      - secret: BASIC_AUTH_FOR_XYZ
        name: KONTENA_LB_BASIC_AUTH_SECRETS
        type: env
...
```

To write the configuration to the Kontena Vault, use the following:

```
$ kontena vault write BASIC_AUTH_FOR_XYZ << EOF
→ user user1 password <bcrypt_password>
→ user user2 insecure-password pass1234
→ EOF
```

If you want to use encrypted passwords, note that encrypted passwords are evaluated using the crypt(3) function in order to support different algorithms. For example, MD5, SHA-256 and SHA-512 are supported. To generate an encrypted password you can use the following examples:

```
mkpasswd -m sha-512 passwd
```

Or, if your system does not have `mkpasswd` available but you have Docker available, use the following:

```
docker run -ti --rm alpine mkpasswd -m sha-512 passwd
```

## Using Kontena Load Balancer for SSL Termination

Kontena Load Balancer supports SSL termination for certificates. Certificates are provided to Kontena Load Balancer using the `SSL_CERTS` environment variable. Usually, you describe these variables in the Kontena Stack File, but in this case you shouldn't. While it is theoretically possible to describe your certificates as part of the Kontena Stack File, we don't recommend doing that due to security concerns. Instead, we recommend using [Kontena Vault](vault.md).

#### Preparing Traditional SSL Certificates

The Kontena Load Balancer is expecting SSL certificate as a `.pem` file, which contains a public certificate followed by a private key. The public certificate must be placed before the private key; order matters.

If you want to create a self-signed certificate, you can run the following script to generate and package a certificate as `.pem` file:

```
$ openssl req -x509 -newkey rsa:2048 -keyout key.pem -out ca.pem -days 1080 -nodes -subj '/CN=*/O=My Company Name LTD./C=US'
$ cat ca.pem key.pem > cert.pem
```

If you have a real certificate, it must be packaged as a `.pem` file. The structure is as follows: cert, intermediates and private key. Please note, the `.pem` file must contain both a public certificate and a private key. For example:

```
$ cat STAR_kontena_io.crt STAR_kontena_io.ca-bundle key.pem > cert.pem
```

Finally, once you have the `.pem` file, you can store it in the Kontena Vault like this:

```
$ kontena vault write <MY_CERT_NAME> "$(cat cert.pem)"
```

Where `MY_CERT_NAME` is the name of your SSL certificate in Kontena Vault.

#### Preparing LetsEncrypt Certificates

Kontena Vault has built-in support and integration with LetsEncrypt. Therefore, it is possible to [use LetsEncrypt SSL certificates](vault.md#using-letsencrypt-certificates) instead of traditional SSL certificates.

#### Using SSL Certificates from Kontena Vault

You can expose a certificate (or any other secrets) stored in Kontena Vault to Kontena Load Balancer like this:

```yaml
...
services:
  my_loadbalancer:
    image: kontena/lb:latest
    ports:
      - 443:443
    secrets:
      - secret: <MY_CERT_NAME>
        name: SSL_CERTS
        type: env
...
```

Where `MY_CERT_NAME` is the name of your SSL certificate in Kontena Vault. If you need to expose multiple certificates, you can do it like this:

```yaml
...
services:
  loadbalancer:
    image: kontena/lb:latest
    ports:
      - 443:443
    secrets:
      - secret: <MY_CERT1_NAME>
        name: SSL_CERTS
        type: env
      - secret: <MY_CERT2_NAME>
        name: SSL_CERTS
        type: env
...
```

Where `MY_CERT1_NAME` and `MY_CERT2_NAME` are names of the certificates you have stored in Kontena Vault before.

## Various Configuration Examples

#### Internet Facing Load Balancer

It's usually a good idea to keep the internet facing load balancer in a separate stack. Other stacks that need the internet facing loadbalancer can link to it on-demand.


The shared internet facing loadbalancer stack:

```yaml
stack: my/internet-lb
...
services:
  lb:
    image: kontena/lb:latest
    ports:
      - "80:80"
```

The Application stack that binds to the shared internet facing loadbalancer:

```yaml
...
services:
  web:
    image: nginx:latest
    environment:
      - KONTENA_LB_MODE=http
      - KONTENA_LB_BALANCE=roundrobin
      - KONTENA_LB_INTERNAL_PORT=80
      - KONTENA_LB_VIRTUAL_HOSTS=www.kontena.io,kontena.io
    links:
      - internet-lb/lb
  api:
    image: registry.kontena.local/restapi:latest
    environment:
      - KONTENA_LB_MODE=http
      - KONTENA_LB_BALANCE=roundrobin
      - KONTENA_LB_INTERNAL_PORT=8080
      - KONTENA_LB_VIRTUAL_PATH=/api
    links:
      - internet-lb/lb
...
```

#### Internal TCP Load Balancer

```yaml
...
services:
  galera_lb:
    image: kontena/lb:latest

  galera:
    image: registry.kontena.local/galera:latest
    environment:
      - KONTENA_LB_MODE=tcp
      - KONTENA_LB_BALANCE=leastconn
      - KONTENA_LB_EXTERNAL_PORT=3306
      - KONTENA_LB_INTERNAL_PORT=3306
    links:
      - galera_lb
...
```

## Hints, Tips and Best Practices

#### Accessing Kontena Load Balancer Statistics

Kontena Load Balancer exposes a statistics web UI only on the private overlay network. To access the statistics you must use the [VPN](vpn-access.md) to access the overlay network. The statistics are exposed on port 1000 of the Kontena Load Balancer instances. You can also expose port 1000 using the ports option in `kontena.yml`, but remember to overwrite the default password.

#### Removing <NOSRV> / BADREQ log entries

From HAProxy docs:
> Recently some browsers started to implement a "pre-connect" feature
consisting of speculatively connecting to some recently visited web sites
just in case the user would like to visit them. This results in many
connections being established to websites, which end up in 408 Request
Timeouts if the timeout strikes first, or 400 Bad Requests when the browser
decides to close them first. These ones pollute the log and feed the error
counters.

To remove these polluting lines in the logs use the following config for your loadbalancer:
```yaml
...
environment:
    KONTENA_LB_CUSTOM_SETTINGS: |
      option http-ignore-probes
...
```

See HAProxy [docs](http://cbonte.github.io/haproxy-dconv/1.6/configuration.html#option%20http-ignore-probes) for details.
