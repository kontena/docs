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

#### Register for LE

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

#### Create domain authorization

To be able to request certificates for a domain you must first prove that you are in charge of that domain. For this, Kontena certificate management supports both DNS and TLS-SNI verifications.

**TLS-SNI based verification**

```bash
$ kontena certificate authorize --type tls-sni-01 --linked-service infra/lb api.example.com
[done] Waiting for tls-sni-01 certificate to be deployed into my-grid/infra/lb
TLS-SNI challenge certificate is deployed, you can now request the actual certificate
```

Kontena automatically links the special certificate LE gives us and deploys the linked service. Naturally the linked service is usually Kontena LB. Only thing user needs to configure is a public DNS record for the domain(s) to point to the linked service.

When later on requesting the certificate, LE will make special SSL connection to the server(s) for which it expects the server to present the certificate.


**DNS based verification**

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

If you have made the authorizations of all the domain in the certificate using `tls-sni-01` authorization model Kontena will automatically renew the certificate 7 days prior to it's expiration. In practice this means that you must do the first request for the certificate manually and after that the management is fully automated.

For `dns-01` authorized certificate the renewal process is fully manual as Kontena cannot automate the DNS challenge fullfilment part.


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