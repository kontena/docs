# Kontena CLI Tools

## Installing Kontena CLI

# System Requirements

Following are the version requirements for components on which Kontena depends:

* **Kontena CLI:** Official package or Ruby >= 2.1
  * **Local Image Builds (optional):** Docker 1.12.x or later
  * **VPN (optional):** OpenVPN client

### MacOS (OSX)

You can install Kontena CLI using our [official installer](https://github.com/kontena/kontena/releases/latest).

### Linux / Windows

> Prerequisites: You'll need Ruby version 2.1 or later installed on your system. For more details, see the official [Ruby installation docs](https://www.ruby-lang.org/en/documentation/installation/).


You can install the Kontena CLI using the Rubygems package manager, which is included in Ruby.

```
$ gem install kontena-cli
```

After the installation is complete, you can test the installation by checking the Kontena CLI version with `kontena version`.

**OPTIONAL**

To enable tab-completion for bash, add the following to your `.bashrc` scripts:

```
which kontena > /dev/null && . "$( kontena whoami --bash-completion-path )"
```
