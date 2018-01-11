# Using Kontena Vault

[Kontena Vault](./README.md#kontena-vault) is a secure key-value storage system that can be used to manage secrets for Kontena Stacks and Services in your Kontena Platform. Kontena Vault has built-in integration for managing LetsEncrypt certificates.

In this chapter, we'll discover how to manage secrets with Kontena Vault:

* [List Secrets](#list-secrets)
* [Write a Secret](#write-a-secret-to-vault)
* [Read a Secret](#read-a-secret)
* [Update Secret](#update-secret)
* [Remove a Secret](#remove-a-secret)
* [Using LetsEncrypt Certificates](#using-letsencrypt-certificates)

## List Secrets

```
$ kontena vault ls
```

## Write a Secret to Vault

```
$ kontena vault write <name> <value>
```

## Read a Secret

```
$ kontena vault read <name>
```

**Note:** Every read command will be added to the Kontena Master audit log

## Update Secret

```
$ kontena vault update <name> <value>
```

## Remove a Secret

```
$ kontena vault rm <name>
```

## Using LetsEncrypt Certificates

Kontena Vault integrates natively with [Let's Encrypt](https://letsencrypt.org) to provide easy-to-use certificate management for your Kontena Services.

The following chapters describe the flow of getting certificates from Let's Encrypt: register --> authorize domain --> request certificate

### Register for LE

To use Let's Encrypt, you must first register as a user.

```
$ kontena certificate register <you@example.com>
```

By default this creates a new private key to be used with LE to identify the client.

**Note:** If you have already registered with other means and have an existing private key you wish to use you can import it into vault using the specific name `LE_PRIVATE_KEY`

```
$ kontena vault write LE_PRIVATE_KEY "$(cat priv_key.pem)"
```

The email is needed for Let's Encrypt to notify when certificates are about to expire.

**Note:** This registration is needed only once per Kontena Platform.

### Create domain authorization

In order to request a Let's Encrypt certificate for any domains, you must first prove that you are in control of each domain.
Kontena's certificate management for Let's Encrypt supports different challenge types:

* `dns-01` (since <1.0)
* `tls-sni-01` (since 1.4)
* `http-01` (since 1.4.x/1.5)

In order to use the automated challenge methods, HTTP/HTTPS connections to the domain(s) in question must be handled by a [Kontena Load Balancer](loadbalancer.md) service.

#### HTTP-01 based verification

The `http-01` challenge is the most popular choice, and allows for automated certificate renewals.

```bash
$ kontena certificate authorize --type http-01 --linked-service ingress-lb/lb api.example.com
 [done] Waiting for http-01 challenge to be deployed into my-grid/ingress-lb/lb      
HTTP challenge is deployed, you can now request the actual certificate
```

Kontena automatically provisions the acme-challenge token/key-authorizations provided by LE to the linked service in the form of `ACME_CHALLENGE_*` environment variable secrets.
The linked service is typically a [Kontena Load Balancer](loadbalancer.md) service which responds to `GET /.well-known/acme-challenge` requests using the provisioned tokens.

Later on when requesting the certificate, the Let's Encrypt verification servers will connect to the domain on TCP port 80, and make a HTTP request for the challenge token.
The `--linked-service` must be configured to expose port 80.

#### TLS-SNI based verification

The `tls-sni-01` challenge can also be used for automated certificate renewals.

```bash
$ kontena certificate authorize --type tls-sni-01 --linked-service ingress-lb/lb api.example.com
[done] Waiting for tls-sni-01 certificate to be deployed into my-grid/ingress-lb/lb
TLS-SNI challenge certificate is deployed, you can now request the actual certificate
```

Kontena automatically provisions the challenge certificate provided by LE to the linked service in the form of `SSL_CERT_acme_challenge_*` environment variable secrets.
The linked service is typically a [Kontena Load Balancer](loadbalancer.md) service which responds to TLS-SNI connections for the `*.acme.invalid` challenge certificate subject name.

Later on when requesting the certificate, the Let's Encrpyt verification servers will connect to the domain on TCP port 443, and establish a TLS connection for the challenge hostname.
The `--linked-service` must be configured to expose port 443.

#### DNS based verification

```bash
$ kontena certificate authorize api.example.com
Record name:_acme-challenge
Record type:TXT
Record content:5m1FCaNvneLduTN4AcPqAbyuQhBQA4ESisAQfEYvXIE
```

To verify that you really control the requested domain, create a DNS TXT record for the domain `_acme-challenge.api.example.com` with content specified in the response.

#### Get actual certificate

Once you have created the necessary DNS proof of domain control you can request the actual certificate.

```
$ kontena certificate request api.example.com

```

Kontena automatically stores the certificate in a secure vault in a format where it can be used for SSL termination with Kontena Load Balancer.

Let's Encrypt does not (yet) support wildcard certificates. In many cases it is necessary to serve multiple sites behind one certificate. For this, Let's Encrypt supports a concept called subject alternative names (SAN). To obtain a certificate for multiple DNS names, simply specify them in the request:

```
$ kontena certificate request example.com www.example.com
```
**Note:** For each of the domains in the certificate request, it is necessary to complete the domain authorization first! The first domain in the list becomes the common name and others are used as alternative names:

```
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number:
            fa:2c:99:7a:4e:76:10:97:fe:b9:7b:28:4a:c3:44:7a:fe:b1
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN=Fake LE Intermediate X1
        Validity
            Not Before: Jul  1 06:31:00 2016 GMT
            Not After : Sep 29 06:31:00 2016 GMT
        Subject: CN=example.com
        Subject Public Key Info:
        ...
        X509v3 extensions:
            X509v3 Subject Alternative Name:
                DNS:www.example.com, DNS:example.com
```

By default Kontena stores the full chain version of the certificate. This is because Let's Encrypt intermediaries are not trusted by all client libraries (such as some libraries associated with Ruby, Docker, and wget, for example).

#### Using certificates

Starting from Kontena 1.4 version, the [Kontena Stack YAML](stack-file.md#using-certificates) services can include Kontena managed Let's Encrypt `certificates`:


```yaml
services:
  my_loadbalancer:
    image: kontena/lb:latest
    ports:
      - 443:443
    certificates:
      - subject: www.example.com
        type: env
        name: SSL_CERT_www.example.com
```

Kontena will inject the certificate from the vault into the `SSL_CERT_*` environment variable for the service instance container.

#### Renewing Let's Encrypt certificates

If you have made the authorizations of all the domain in the certificate using either `http-01` or `tls-sni-01` type authorizations, then Kontena will automatically renew the certificate 7 days prior to it's expiration.
In practice this means that you must do the first request for the certificate manually and after that the management is fully automated.

For `dns-01` domain authorizations, the renewal process is fully manual as Kontena cannot automate the DNS challenge provisioning.
The expiration and auto-renewal support for each certificate can be checked using `kontena certificate list`.

#### Inspecting certificate details

To get a list of managed certificates, use:


```
$ kontena certificate list
SUBJECT                         EXPIRATION    AUTO_RENEWABLE?
⊛ tls-sni-test.example.io       11 days ago   false
⊛ web.52.59.23.97.xip.io        36 days       true
⊛ demo.kontena.works            69 days       true

```

To see single certificate details, use:

```
$ kontena certificate show web.52.59.23.97.xip.io
---
id: e2e/web.52.59.23.97.xip.io
subject: web.52.59.23.97.xip.io
valid_until: '2017-11-22T09:55:00.000+00:00'
alt_names: []
auto_renewable: true
```

#### Exporting a certificate

To export a managed certificate, use:

```
$ kontena certificate export example.com
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

This outputs the entire certificate bundle by default. Use the `--cert`, `--chain` or `--key` options to export the different parts of the certificate separately.
