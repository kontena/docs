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
* **`SSL_CERTS`** and **`SSL_CERT_*`** - SSL certificates to be used. See more at [SSL Termination](loadbalancer.md#ssl-termination).
* **`KONTENA_LB_SSL_CIPHERS`** - SSL Cipher suite used by the load balancer when operating in SSL mode. See more at [SSL Ciphers](loadbalancer.md#configuringcustomsslciphers)
* **`KONTENA_LB_CUSTOM_SETTINGS`** - Custom settings; each line will be appended to `defaults` section in the HAProxy configuration file.
* **`KONTENA_LB_ACCEPT_PROXY`** - Enables proxy protocol (accept-proxy).
* **`KONTENA_LB_HTTP2`** - Enable HTTP2 support. Default: `true`.

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
      - my_loadbalancer
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
* **`KONTENA_LB_VIRTUAL_PATH`** - Specify a comma separated list of paths that are used to match the request. This may be used only if `KONTENA_LB_MODE` is set to `http`. For example, if you set a value here for "/api", then any request to e.g. "/api/foo" is proxied to "/foo" in your application.
* **`KONTENA_LB_KEEP_VIRTUAL_PATH`** - If set to true, the virtual path will be kept in the request path. This may be used only if `KONTENA_LB_MODE` is set to `http`. Default: `false`.
* **`KONTENA_LB_COOKIE`** - Enables cookie-based session stickiness. With an empty value, it defaults to the load balancer-set cookie. Can be customized to use application cookies. See details at [HAProxy docs](https://cbonte.github.io/haproxy-dconv/1.8/configuration.html#4.2-cookie).
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

The Kontena Load Balancer can be used to perform SSL termination for Kontena Services linked to the Load Balancer. The SSL certificates for each service must be deployed to the Kontena Load Balancer service.

SSL certificates are deployed to the Kontena Load Balancer via the `SSL_CERTS` and `SSL_CERT_*` environment variables. The Kontena Load Balancer supports TLS-SNI, and will select the correct certificate to use based on the hostname that the client is connecting to.

The `SSL_CERTS`/`SSL_CERT_*` environment variables should not be configured directly in the service environment, but using [`secrets`](stack-file.md#using-secrets) or [`certificates`](stack-file.md#using-certificates) stored in the [Kontena Vault](vault.md).
Starting from Kontena 1.4, Let's Encrypt certificates are managed using the newer [`kontena certificate`](vault.md#using-letsencrypt-certificates) certificates and service [certificates](stack-file.md#using-certificates).
The older style of [`kontena vault`](vault.md) secrets and service [secrets](stack-file.md#using-secrets) is still supported for externally managed certificates.

### Using automated Let's Encrypt certificates

Kontena has built-in support for Let's Encrypt, using either `DNS-01` challenges or fully automated `TLS-SNI-01` challenges integrated with the Kontena Load Balancer.

To use Let's Encrypt certificates with the Kontena Load Balancer:

* [Use the Kontena CLI to register for Let's Encrypt](vault.md#register-for-le)
* [Create domain authorization challenges](vault.md#create-domain-authorization)
* [Request the certificate](vault.md#get-actual-certificate)

Once you have the Let's Encrpyt certificates for your domain visible in `kontena certificate list`, you may proceed to deploy them to the Kontena Load Balancer.

### Using externally managed SSL certificates

Externally managed SSL certificates can also be imported into Kontena, for use in the Kontena Load Balancer. These can be self-signed certificates, or any other non-Let's Encrypt certificates, such as wildcard certificates.

To import a certificate, you need the certificate, the private key and any optional intermediate certificate chain certs as separate PEM files:

```
$ kontena certificate import --private-key key.pem --chain ca-chain.pem cert.pem
 [done] Importing certificate from cert.pem...
development/test:
  subject: test
  valid until: 2017-11-30T19:30:52Z
  alt names:
    - test-1
  auto renewable: false
```

These imported certificates can be used identically to Let's Encrypt managed certificates, except that they will not be auto-renewed by Kontena.

### Deploying SSL certificates from Kontena Vault `certificates`

The SSL certificate stored in the Kontena Vault certificate is deployed to the Kontena Load Balancer using an `SSL_CERT_*` [env certificate](stack-file.md#using-certificates):

```yaml
services:
  lb:
    image: kontena/lb:latest
    ports:
      - 443:443
    certificates:
      - subject: www.example.com
        type: env
        name: SSL_CERT_www.example.com
```

To deploy multiple certificates, use multiple `SSL_CERT_*` envs, one for each certificate:

```yaml
services:
  lb:
    image: kontena/lb:latest
    ports:
      - 443:443
    certificates:
      - subject: www.example.com
        type: env
        name: SSL_CERT_www.example.com
      - subject: test.example.com
        type: env
        name: SSL_CERT_test.example.com
```

Alternatively, use multiple `SSL_CERTS` envs to deploy the certificates, but be aware of the [limitations on the number of SSL certificates](#limitations-on-the-number-of-ssl-certificates) deployed in this way:

```yaml
services:
  lb:
    image: kontena/lb:latest
    ports:
      - 443:443
    certificates:
      - subject: www.example.com
        type: env
        name: SSL_CERTS
      - subject: test.example.com
        type: env
        name: SSL_CERTS
```

#### Prompting for SSL certificates from Kontena `certificates`

The [Kontena Stack Variables `certificates` resolver](../references/stack-file-variables.md#certificates) can be used to dynamically prompt for multiple SSL certificates stored in Kontena Vault certificates:

```yaml
variables:
  lb_certs:
    type: array
    required: false
    from:
      certificates: Select SSL certificates
services:
  loadbalancer:
    image: kontena/lb:latest
    ports:
      - 443:443
    # {% if lb_certs %}
    certificates:
      # {% for subject in lb_certs %}
      - subject: {{ subject }}
        name: "SSL_CERT_{{ subject }}"
        type: env
      # {% endfor %}
    # {% endif %}
```

### Using older secrets-based certificates

Previous releases of Kontena did not support the new `certificates` model, and certificate bundles were stored and used from [Kontena Vault secrets](vault.md).

These certificate bundles must be structured in a certain way to be used with the Kontena Load Balancer.

With newer versions of Kontena, the use of the `kontena certificate` commands is recommended.

#### Preparing the SSL Certificate bundle

The Kontena Load Balancer expects SSL certificates in the form of a PEM-encoded certificate bundle, containing the `CERTIFICATE`, any optional intermediate CA `CERTIFICATE` chain, and the `PRIVATE KEY` last.

Using a self-signed certificate as an example:

```
$ openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 1080 -nodes -subj '/CN=example.com'
```

The certificate bundle must be generated by concatenating the certificate and private key files:

```
$ cat cert.pem key.pem > bundle.pem
```

If your certificate is issued by an intermediate CA that is not directly trusted by the client, you may also include optional intermediate CA certificate chains in the bundle:

```
$ cat cert.pem ca.pem key.pem > bundle.pem
```

The order of the SSL certificate bundle is important: the certificate must be first, followed by any optional intermediate CA certificate chain, with the private key at the end. The last line in the bundle must be `-----END PRIVATE KEY-----` or some variation of `-----END * PRIVATE KEY-----`!

#### Storing SSL certificate bundles in Kontena Vault `secrets`

To deploy the certificate bundle to the Kontena Load Balancer, you must first store it into Kontena Vault.

```
$ kontena vault write SSL_CERT_example.com < bundle.pem"
```

#### Deploying SSL certificates from Kontena Vault `secrets`

The certificate bundle stored in the Kontena Vault `SSL_CERT_example.com` secret is deployed to the Kontena Load Balancer using an `SSL_CERTS` [env secret](stack-file.md#using-secrets):

```yaml
services:
  my_loadbalancer:
    image: kontena/lb:latest
    ports:
      - 443:443
    secrets:
      - secret: SSL_CERT_example.com
        name: SSL_CERTS
        type: env
```

To deploy multiple certificate bundles, use multiple `SSL_CERT_*` or `SSL_CERTS` env secrets:

```yaml
services:
  loadbalancer:
    image: kontena/lb:latest
    ports:
      - 443:443
    secrets:
      - secret: SSL_CERT_example.com
        name: SSL_CERTS
        type: env
      - secret: SSL_CERT_test.example.com
        name: SSL_CERT_test.example.com
        type: env
```

#### Prompting for SSL certificates from Kontena Vault `secrets`

The [Kontena Stack Variables `vault_cert_prompt` resolver](../references/stack-file-variables.md#vaultcertprompt) can be used to dynamically prompt for multiple SSL certificate bundles stored in Kontena Vault secrets:

```yaml
variables:
  lb_certs:
    type: array
    required: false
    from:
      vault_cert_prompt: Pick SSL cert(s) from Vault
services:
  loadbalancer:
    image: kontena/lb:latest
    ports:
      - 443:443
    secrets:
      # {% if lb_certs %}
      # {% for cert in lb_certs %}
      - secret: {{ cert }}
        name: SSL_CERTS
        type: env
      # {% endfor %}
      # {% endif %}
```

The Kontena Vault secrets must have names matching `ssl` or `certs`.

### Limitations on the number of SSL certificates

Using separate `SSL_CERT_*` envs for each certificate will allow deploying a large number of certificates, up to the OS's total size limit on the process environment. This is typically around 2MB, which allows for several hundred typical Let's Encrypt SSL certificates.

When using multiple `SSL_CERTS` envs, all of the certificates will be merged into a single `SSL_CERTS` environment variable. There is a limit of 128KB on the total size of the `SSL_CERTS` environment variable within Linux. For typical Let's Encrypt certificates, you may expect to hit the limit at around 25 certificates per LB service.

Note that the TLS-SNI challenge certificates used for [`kontena certificate authorize --type tls-sni-01`](vault.md#create-domain-authorization) domain authorizations also count towards the `SSL_CERTS` limit, but the size of the challenge certificates is much smaller than normal. You may expect to hit the limit at around 50 pending domain authorizations.

If you attempt to use too many SSL certificates and/or domain authorizations and exceed the combined `SSL_CERTS` env size limit, the LB service will continue to run using the existing certificates, and the deploy will fail with an error: `Kontena::Models::ServicePod::ConfigError: Env SSL_CERTS is too large at ... bytes`

## Kontena Load Balancer Health Checks

By default, the Kontena Load Balancer will perform TCP healthchecks for all service backends, including both `tcp` and `http` (default) `KONTENA_LB_MODE` services. The load balancer will consider the service backend unhealthy if it is unable to connect to the `KONTENA_LB_INTERNAL_PORT`, and will stop routing incoming requests/connections to that backend.

#### Using HTTP health checks

To use HTTP healthchecks for a `KONTENA_LB_MODE=http` service (default), you must also configure a `health_check` with `protocol: http` for the Kontena Service:

```yaml
services:
  whoami:
    image: jwilder/whoami
    links:
      - $lb
      environment:
        - KONTENA_LB_MODE=http
        - KONTENA_LB_INTERNAL_PORT=8000
        - KONTENA_LB_VIRTUAL_PATH=/
      health_check:
        protocol: http
        port: 8000
        uri: /
```

The load balancer will consider the service backend unhealthy if it is unable to connect to the `KONTENA_LB_INTERNAL_PORT`, or if it receives a non-2xx/3xx HTTP response.

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

See HAProxy [docs](https://cbonte.github.io/haproxy-dconv/1.8/configuration.html#4.2-option%20http-ignore-probes) for details.
