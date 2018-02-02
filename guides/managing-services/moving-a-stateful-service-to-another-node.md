# Moving a stateful service to another node

Options:

1. If possible backup the services data with a tool like `mysqldump`. Then delete the service and install it to another node and then restore the data.
2. SSH in to the node, find the volume and move that to the another node.

