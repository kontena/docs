# Installing Kontena Platform Master on Container Linux

## Prerequisites

- [Kontena CLI](cli.md)

## Install Kontena Platform Master

Example cloud-config:

```yaml
#cloud-config
write_files:
  - path: /etc/kontena-server.env
    permissions: 0600
    owner: root
    content: |
      KONTENA_VERSION=latest
      KONTENA_VAULT_KEY=<your vault_key>
      KONTENA_VAULT_IV=<your vault_iv>
      KONTENA_INITIAL_ADMIN_CODE=<initial_admin_code>
      SSL_CERT="/etc/kontena-server.pem"

  - path: /etc/kontena-server.pem
    permissions: 0600
    owner: root
    content: |
      <your ssl_certificate>

  - path: /opt/bin/kontena-haproxy.sh
    permissions: 0755
    owner: root
    content: |
      #!/bin/sh
      if [ -n "$SSL_CERT" ]; then
        SSL_CERT=$(awk 1 ORS='\\n' $SSL_CERT)
      else
        SSL_CERT="**None**"
      fi
      /usr/bin/docker run --name=kontena-server-haproxy \
        --link kontena-server-api:kontena-server-api \
        -e SSL_CERT="$SSL_CERT" -e BACKEND_PORT=9292 \
        -p 80:80 -p 443:443 kontena/haproxy:latest
coreos:
  units:
    - name: kontena-server-mongo.service
      command: start
      enable: true
      content: |
        [Unit]
        Description=kontena-server-mongo
        After=network-online.target
        After=docker.service
        Description=Kontena Server MongoDB
        Documentation=http://www.mongodb.org/
        Requires=network-online.target
        Requires=docker.service

        [Service]
        Restart=always
        RestartSec=5
        ExecStartPre=/usr/bin/docker pull mongo:3.0
        ExecStartPre=-/usr/bin/docker create --name=kontena-server-mongo-data mongo:3.0
        ExecStartPre=-/usr/bin/docker stop kontena-server-mongo
        ExecStartPre=-/usr/bin/docker rm kontena-server-mongo
        ExecStart=/usr/bin/docker run --name=kontena-server-mongo \
            --volumes-from=kontena-server-mongo-data \
            mongo:3.0 mongod --smallfiles
        ExecStop=/usr/bin/docker stop kontena-server-mongo

    - name: kontena-server-api.service
      command: start
      enable: true
      content: |
        [Unit]
        Description=kontena-server-api
        After=network-online.target
        After=docker.service
        Description=Kontena Agent
        Documentation=http://www.kontena.io/
        Requires=network-online.target
        Requires=docker.service

        [Service]
        Restart=always
        RestartSec=5
        EnvironmentFile=/etc/kontena-server.env
        ExecStartPre=-/usr/bin/docker stop kontena-server-api
        ExecStartPre=-/usr/bin/docker rm kontena-server-api
        ExecStartPre=/usr/bin/docker pull kontena/server:${KONTENA_VERSION}
        ExecStart=/usr/bin/docker run --name kontena-server-api \
            --link kontena-server-mongo:mongodb \
            -e MONGODB_URI=mongodb://mongodb:27017/kontena_server \
            -e VAULT_KEY=${KONTENA_VAULT_KEY} -e VAULT_IV=${KONTENA_VAULT_IV} \
            -e INITIAL_ADMIN_CODE=${KONTENA_INITIAL_ADMIN_CODE} \
            kontena/server:${KONTENA_VERSION}
        ExecStop=/usr/bin/docker stop kontena-server-api

    - name: kontena-server-haproxy.service
      command: start
      enable: true
      content: |
        [Unit]
        Description=kontena-server-haproxy
        After=network-online.target
        After=docker.service
        Description=Kontena Server HAProxy
        Documentation=http://www.kontena.io/
        Requires=network-online.target
        Requires=docker.service

        [Service]
        Restart=always
        RestartSec=5
        EnvironmentFile=/etc/kontena-server.env
        ExecStartPre=-/usr/bin/docker stop kontena-server-haproxy
        ExecStartPre=-/usr/bin/docker rm kontena-server-haproxy
        ExecStartPre=/usr/bin/docker pull kontena/haproxy:latest
        ExecStart=/opt/bin/kontena-haproxy.sh
        ExecStop=/usr/bin/docker stop kontena-server-haproxy
```

`KONTENA_VAULT_KEY` & `KONTENA_VAULT_IV` should be random strings. They can be generated from bash:

```
$ cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 64 | head -n 1
```

The SSL certificate specified is a pem file, containing a public certificate followed by a private key (the public certificate must be placed before the private key; order matters).

`KONTENA_INITIAL_ADMIN_CODE` can be any user generated string.

## Login to Kontena Platform Master

After the Kontena Platform Master has started, you can authenticate as local administrator using the `KONTENA_INITIAL_ADMIN_CODE`. Please refer to [authentication](../authentication.md) for information about how to log in with the admin code and how to configure [Kontena Cloud](https://cloud.kontena.io) as the authentication provider.
