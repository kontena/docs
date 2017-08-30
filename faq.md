# Frequently Asked Questions

## How do I get started with Kontena?

We recommend that you start with our [quick start](getting-started/quick-start.md) guide.

## What makes Kontena special?

Kontena is built to maximize developer happiness. Due to its simplicity, it does not require dedicated ops teams to administer, operate or maintain the platform. It is a container orchestration platform that just works. Since developers don't need to worry about the platform, they can focus on creating the stuff that matters.

## How does Kontena Work?

With Kontena, the user starts by telling the Kontena system to run a stack that is composed of one or more containers. The Kontena system will then automatically choose the host or hosts to run those containers. Kontena's scheduler has been influenced by technologies such as [Docker Swarm](https://docs.docker.com/swarm/) and [Kubernetes](http://kubernetes.io/). While the Kontena scheduler shares many similarities and concepts with these container orchestrators, Kontena's scheduler is designed to:

* Work with Services instead of plain containers
* Support both stateless and stateful applications
* Have sane defaults and prefer convention over configuration

Once the containers are ready to be started on the hosts, Kontena will apply a virtual overlay network for the containers to make it possible for them to find and communicate with each other.

## Who is the ideal user of Kontena?

While Kontena works great for all types of businesses and may be used to run containerized workloads at any scale, it's best suited for start-ups and small to medium sized businesses that require a worry-free, simple-to-use platform for running containerized workloads.

## How does Kontena compare to Docker Swarm and Kubernetes?

* **Docker Compose & Swarm**: Tools from Docker are simple but powerful. Therefore, most people start their container journey using those tools. However, while these tools work as promised, you'll end up wanting more. At this point, most of the people try tweaking Docker tools to fit their needs. After a while, they realize the gravity of task ahead and start looking for something that is a complete solution. Kontena is this complete solution. It has all the features you wanted (plus some more you don't realize needing yet), it's well maintained and used by active community of users like you. Instead of tweaking Docker tools to fit your needs, why not just adopt Kontena's ready-made solution?

* **Kubernetes**: Kubernetes by Google is used as a foundation by many container orchestration solutions. It features a robust container scheduler and offers many great ideas and concepts that overlap with Kontena. Hype around Kubernetes is similar to Angular (until React came along). However, it more like a framework rather than a solution. If you do google search "how to make kubernetes more easy", you'll get 1 million search results. Kubernetes is not easy and does not deliver the simple user experience we want to achieve. It is a great foundation (for some), but by itself it's not enough. [GitHub just moved some of their stuff on top of Kubernetes](https://githubengineering.com/kubernetes-at-github/) and it took for their super talented team almost 9 months?! It might sound amazing on paper, but just like many other open source technologies coming out from Google, it is pain to use. We wanted to make Kontena sound great on paper, but most importantly amazing to use :) Don't be silly like GitHub, get started with Kontena. Yeah, we know, the hype and buzz around K8S is just so irresistible... But at least you should try Kontena!

* **Others**: In fact there are very few genuine container orchestration / management platforms out there besides Kontena, Docker Swarm and Kubernetes. Majority of the "other" container platform solutions out there are based on Kubernetes. Kontena aims to deliver the best possible solution for container orchestration with a set of features that are in line with our goal of making something that just works, plain and simple.

## Is Kontena ready for production?

Yes.
