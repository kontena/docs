# Creating Kontena Nodes with Docker Compose

* [Prerequisites](#prerequisites)
* [Create Kontena Node](#install-kontena-node)
* [Restart Kontena Node](#restart-kontena-node)
* [Terminate Kontena Node](#terminate-kontena-node)
* [Update Kontena Node](#update-kontena-node)
* [Advanced Usage](#advanced-usage)

## Prerequisites

* [Kontena CLI](/tools/cli.md)
* Docker Engine version 1.10 or later on each host
* Docker Compose on each host

## Create Kontena Node

#### Step 1: Create `docker-compose.yml` file

```yaml
version: '2'
services:
  agent:
    container_name: kontena-agent
    image: kontena/agent:latest
    network_mode: host
    restart: unless-stopped
    environment:
      - KONTENA_URI=ws://<KONTENA_URI>/
      - KONTENA_TOKEN=<KONTENA_TOKEN>
      - KONTENA_PEER_INTERFACE=eth1
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
```

* `KONTENA_URI` - Specify the URI of the Kontena Platform (use ws:// for a non-tls connection) you want to use. Use `kontena cloud platform env` to see the current Kontena Platform URI.
* `KONTENA_TOKEN` - Specify the token of the Kontena Platform. Use `kontena cloud platform env` to see the current Kontena Platform token.
* `KONTENA_PEER_INTERFACE` - The network interface that is used to connect the other Kontena Nodes.

#### Step 2: Copy `docker-compose.yml` file to each host

#### Step 3: (OPTIONAL) Enable Kontena's built-in private image registry

To allow the Kontena Nodes to pull from Kontena's built-in private image registry, you must add `--insecure-registry="10.81.0.0/16"` to the Docker daemon options on the host machine. The most platform-independent way to do this is with the `/etc/docker/daemon.json` config file:

```
$ cat > /etc/docker/daemon.json <<DOCKERCONFIG
{
  "labels": ["region=<name_here>"],
  "insecure-registries": ["10.81.0.0/16"]
}
DOCKERCONFIG
```

#### Step 4: Run the command `docker-compose up -d` on each host

#### Step 5: Setup DNS

In order to use overlay networking DNS addresses from the host side, you must add the `docker0` bridge IP address into the local DNS server list. Refer to your OS distribution documentation on how to setup DNS servers.

For example, if your OS is using `resolvconf` you can do it like this:

```
echo nameserver 172.17.0.1 | resolvconf -a lo.kontena-docker
```

Replace `172.17.0.1` with your local `docker0` bridge IP address. You can find that for example with:

```
ip addr show docker0
```

If your system is using a local resolver you could add Kontena DNS as a forward zone. E.g. for 'unbound' use:

```
    cat > /etc/unbound/unbound.conf.d/kontena.conf <<CONF
server:
  private-domain: "kontena.local"
  domain-insecure: "kontena.local"

forward-zone:
  name: "kontena.local."
  forward-addr: $DOCKER_GW_IP
CONF
```

## Restart Kontena Node

Not supported via Kontena CLI tool.

## Terminate Kontena Node

Not supported via Kontena CLI tool.

## Update Kontena Node

Kontena Nodes may be updated just by changing the image tag and restarting services. Kontena Master and Agent versions must match at least on `major.minor` versions, although it's recommended to keep versions exactly in sync.

## Advanced Usage

No more advanced usage available :)
