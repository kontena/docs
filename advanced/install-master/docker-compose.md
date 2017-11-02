# Installing Kontena Platform Master with Docker Compose

## Prerequisites

* [Kontena CLI](cli.md)
* Docker Engine version 1.10 or later
* Docker Compose

## Install Kontena Platform Master

**Step 1:** create a `docker-compose.yml` file with the following contents:

```yaml
version: '2'
services:
  haproxy:
    image: kontena/haproxy:latest
    container_name: kontena-server-haproxy
    restart: unless-stopped
    environment:
      - SSL_CERT=**None**
      - BACKENDS=kontena-server-api:9292
    depends_on:
      - master
    ports:
      - 80:80
      - 443:443
  master:
    image: kontena/server:latest
    container_name: kontena-server-api
    restart: unless-stopped
    environment:
      - RACK_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/kontena
      - VAULT_KEY=somerandomverylongstringthathasatleastsixtyfourchars
      - VAULT_IV=somerandomverylongstringthathasatleastsixtyfourchars
      - INITIAL_ADMIN_CODE=loginwiththiscodetomaster
    depends_on:
      - mongodb
  mongodb:
    image: mongo:3.2
    container_name: kontena-server-mongo
    restart: unless-stopped
    volumes:
      - kontena-server-mongo:/data/db
volumes:
  kontena-server-mongo:
```

**Note!** `VAULT_KEY` & `VAULT_IV` should be random strings. They can be generated from bash:

```
$ cat /dev/urandom | LC_ALL=C tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1
```

`KONTENA_INITIAL_ADMIN_CODE` can be any user generated string.

**Note!** If you want to use a SSL certificate you can use the following command to obtain the correct value for `SSL_CERT`:
```
$ awk 1 ORS='\\n' /path/to/cert_file
```

If you don't have an SSL certificate, you can generate a self-signed certificate with:
```
$ openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt
cat certificate.crt privateKey.key > cert.pem
```

**Step 2:** Run the command `docker-compose up -d`

## Login to Kontena Platform Master

After the Kontena Platform Master has started, you can authenticate as the local administrator using the `KONTENA_INITIAL_ADMIN_CODE`. Please refer to [authentication](../authentication.md) for information about how to log in with the admin code and how to configure [Kontena Cloud](https://cloud.kontena.io) as the authentication provider.

## Updating Kontena Platform Master

Kontena Platform Master & Agent can be updated just by changing the image tag and restarting services. The Kontena Platform Master and Agent versions must match at least on `major.minor` versions, although it's recommended to keep versions exactly in sync.
