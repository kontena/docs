# Use Docker images from Kontena private repositories

This page shows you how to configure your Kontena Platform to pull images from your private Kontena repositories

## Before your begin

* You need to have Kontena Platform running, see our [quickstart guide](../../quickstart.md)
* You need to have a [Kontena Cloud](https://cloud.kontena.io) account and organization created
* You need to have Kontena [CLI](../../tools/cli.md)
* You need to have the cloud olugin installed on the CLI.
    `kontena plugin ls` to see if it is installed, and  `kontena plugin install cloud` if not already there.
* CLI needs to be connected to the platform you wish to configure. Use `kontena cloud platform use xyz/foobar` to use a certain platform.

## Create an authorization token

The platform nodes need a security token to pull images from private Kontena Image Repositories. So first we need to create a token suited for that purpose.

```
kontena cloud token create external-registry-token
asdfghjklqwertyuiop
```

We'll use this token in the next steps, so donät lose it yet.

## Configure external registry on your Kontena Platform

We'll configure the credential on a external registry on the platform level. While connected

```
kontena external-registry add -u <user_name> -e <email> -p "<token>" images.kontena.io
```

Where the username and email are the ones used in Kontena Cloud.

## Using private images in stacks

Now when the platform is configured to be able to pull images from the private repositories at images.kontena.io service, we can actually use the images in our stacks. To do that, we need to use fully qualified name for the images, like so:
```
image: images.kontena.io/my-organization/my-image:v1.0.0
```

So use the fully qualified name of the image.

Now when Kontena sees the hostname part of the fully qualified image name to match the configuration in `external-registry` it will instruct Docker to pull the image using the suppplied credentials.

