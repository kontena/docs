# Using nsenter to access a node without SSH

In addition SSH, [nsenter](https://github.com/jpetazzo/nsenter) can be used to gain root access to a node. This method does NOT require any password or authentication, so be sure that your Kontena grid users are trusted.

First you need to install the `nsenter` as a daemon service so that it runs on each node. There is a sample stack in the Kontena Stack Registry:

    $ kontena stack registry pull matti/nsenter
      stack: matti/nsenter
      version: 0.0.1
      description: kontena node nsenter

      services:
        nsenter:
          image: walkerlee/nsenter
          deploy:
            strategy: daemon
          command: "-t 1 -m -u -i -n sleep 2073600"
          privileged: true
          network_mode: host
          pid: host

Install the stack with:

    $ kontena stack install matti/nsenter
      [done] Creating stack nsenter
      [done] Triggering deployment of stack nsenter
      [done] Waiting for deployment to start
      [done] Deploying service nsenter

Then you can enter the first node with

    $ kontena service exec -it nsenter/nsenter bash
      red-fog-1606 $ whoami
      root

And the second instance with

    $ kontena service exec --instance 2 -it nsenter/nsenter bash
      blue-field-283 $ whoami
      root

