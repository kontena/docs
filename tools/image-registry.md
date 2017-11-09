---
title: Image Registry
---

# Kontena Cloud Image Registry

[Kontena Cloud](https://kontena.io/cloud) Image Registry provides a zero-maintenance, secure and ready-to-go solution for storing Docker images.

## Using Kontena Cloud Image Registry

* [Prerequisites](./image-registry.md#prerequisites)
* [Using with Docker CLI](./image-registry.md#using-with-docker-cli)
  * [Login](./image-registry.md#login-with-docker-cli)
  * [Build & push](./image-registry.md#build-push-an-image-with-docker-cli)
  * [Pull](./image-registry.md#pull-an-image-with-docker-cli)
* [List repositories](./image-registry#list-repositories)
* [Create a repository](./image-registry#create-a-repository)
* [Show a repository details](./image-registry#show-a-repository-details)
* [Remove a repository](./image-registry#remove-a-repository)
* [List a repository tags](./image-registry#create-a-repository-tags)
* [Using with Kontena Platform](./image-registry#using-repositories-with-kontena-platform)
  * [Using with Kontena Stacks](./image-registry#using-with-kontena-stacks)
  * [Add image registry configuration](./image-registry#add-image-registry-configuration)
  * [List image registry configurations](./image-registry#list-image-registry-configurations)
  * [Remove an image registry configuration](./image-registry#remove-an-image-registry-configuration)

### Prerequisites

* [Kontena Cloud](https://cloud.kontena.io) account
* [Kontena CLI](/tools/cli.md) with the `cloud` plugin. If you don't have the plugin installed, you can install (or upgrade) it with the: `kontena plugin install cloud` command.

### Using with Docker CLI

#### Login with Docker CLI

##### Automated way

```
$ kontena cloud image-repository docker-login
```

Creates a permanent Kontena Cloud OAuth2 token and runs `docker login -u <YOUR_USERNAME> images.kontena.io` with generated token as the password.

##### Manual way

* Create a permanent Kontena Cloud OAuth2 token:

  ```
  $ kontena cloud token create <NAME>
  ```

* Login with Docker CLI using your Kontena Cloud username and permanent token from the previous step as the password:

  ```
  $ docker login -u <USERNAME> images.kontena.io
  ```

#### Build & Push an image with Docker CLI

Build:

```
$ docker build -t images.kontena.io/<ORG>/<REPO>:<TAG> .
```

Push:

```
$ docker push images.kontena.io/<ORG>/<REPO>:<TAG>
```

#### Pull an image with Docker CLI

```
$ docker pull images.kontena.io/<ORG>/<REPO>:<TAG>
```

### List image repositories

```
$ kontena cloud image-repository list --org <ORG>
```

### Create a repository

```
$ kontena cloud image-repository create --org <ORG> <REPOSITORY>
```

### Show a repository details

```
$ kontena cloud image-repository show <REPOSITORY>
```

### Remove a repository

```
$ kontena cloud image-repository remove <REPOSITORY>
```

### List a repository tags

```
$ kontena cloud image-repository tag list <REPOSITORY>
```

### Using repositories with Kontena Platform

#### Using with Kontena Stacks

Kontena Stack service image should point to the Kontena Cloud Image Registry endpoint. Image URI format is:

```
images.kontena.io/<ORGANIZATION>/<REPOSITORY>:<TAG>
```

Example:

```yaml
services:
  hello:
    image: images.kontena.io/acme/hello:1.0
```

Configures a stack to fetch an image from the `acme` organization, `hello` repository with a tag `1.0`.

> Note: you need to [add image registry configuration](image-registry.md#add-image-registry-configuration) to make this work with Kontena Platform

#### Add Image Registry configuration

* Create a permanent Kontena Cloud OAuth2 token:

  ```
  $ kontena cloud token create <NAME>
  ```

* Add external registry configuration

  ```
  $ kontena external-registry add --username <USERNAME> --email <EMAIL> --password <TOKEN> images.kontena.io
  ```

  - `USERNAME` - your Kontena Cloud username
  - `EMAIL` - your Kontena Cloud email
  - `TOKEN` - Kontena Cloud permanent token from previous step

#### List image registry configurations

```
$ kontena external-registry list
```

#### Remove an image registry configuration

```
$ kontena external-registry remove <NAME>
```
