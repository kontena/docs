# Installing Kontena Platform Master on Vagrant

## Prerequisites

- [Kontena CLI](/tools/cli.md)
- Vagrant 1.6 or later. Visit [https://www.vagrantup.com/](https://www.vagrantup.com/) to get started

## Install Kontena CLI Plugin

```
$ kontena plugin install vagrant
```

## Install Kontena Platform Master

```
$ kontena vagrant master create
```

## Advanced Install Options

```
Usage:
    kontena vagrant master create [OPTIONS]

Options:
    --memory MEMORY               How much memory node has (default: "512")
    --version VERSION             Define installed Kontena version (default: "latest")
    --vault-secret VAULT_SECRET   Secret key for Vault
    --vault-iv VAULT_IV           Initialization vector for Vault
```

#### SSH to Master

```
Usage:
    kontena vagrant master ssh [OPTIONS]
```

#### Start Master

```
Usage:
    kontena vagrant master start [OPTIONS]
```

#### Stop Master

```
Usage:
    kontena vagrant master stop [OPTIONS]
```

#### Restart Master

```
Usage:
    kontena vagrant master restart [OPTIONS]
```

#### Terminate Master

```
Usage:
    kontena vagrant master terminate [OPTIONS]
```
