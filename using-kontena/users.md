# Managing Users

Kontena Platform may be used from Kontena Cloud as a hosted solution or it may be installed as a custom setup. Depending how the Kontena Platform is deployed, learn how to manage users:

* [Managing Users with Kontena Cloud](#managing-users-with-kontena-cloud)
* [Managing Users with Custom Kontena Platforms](#managing-users-with-custom-kontena-platforms)

## Managing Users with Kontena Cloud

> This section is for people using the Kontena Cloud and hosted Kontena Platform deployments. If you are using custom Kontena Platform deployment, please see [Managing Users with Custom Kontena Platforms](#managing-users-with-custom-kontena-platforms) section below.

The users of Kontena Cloud may take advantage of advanced user management. All Kontena Cloud users have by default their own personal account, but in addition they may belong to one or more organizations. As a member of organization, the user role may be `admin` or `member`. Admin users can manage the organization settings and invite more users. Members may use the organization resources. If you have a personal Kontena Cloud account, you are automatically Admin of this personal "organization", but you can not invite more users.

The users who are members of an organization, may be assigned to hosted Kontena Platforms with different roles: `devops`, `dev`, `ops` or `manager`. The roles and their description within the scope of platform the role is given:

* **`devops`** - The super user. Can do everything `dev` and `ops` can do.
* **`dev`** - The developer user. Can use Kontena Platform to deploy stacks, access logs, use Kontena Vault and more.

**Manage Kontena Cloud Organization Users**

* [List Organization Users](#list-organization-users)
* [Add User to Organization](#add-user-to-organization)
* [Remove User from Organization](#remove-user-from-organization)
* [Add User Role to Organization](#add-user-role-to-organization)
* [Remove User Role from Organization](#remove-user-role-from-organization)

**Manage Kontena Platform Users**

* [List Kontena Platform Users](#list-kontena-platform-users)
* [Add User to Kontena Platform](#add-user-to-kontena-platform)
* [Remove User from Kontena Platform](#remove-user-from-kontena-platform)
* [Add User Role to Kontena Platform](#add-user-role-to-kontena-platform)
* [Remove User Role from Kontena Platform](#remove-user-role-from-kontena-platform)

#### List Organization Users

```
$ kontena cloud org user list
```

#### Add User to Organization

```
$ kontena cloud org user add [--role=member] <ORGANIZATION> <USERNAME1> ...
```

#### Remove User from Organization

```
$ kontena cloud org user remove <ORGANIZATION> <USERNAME1> ...
```

#### List Kontena Platform Users

```
$ kontena cloud platform user list
```

#### Add User to Kontena Platform

```
$ kontena cloud platform user add [--role=developer] <PLATFORM> <USERNAME1> ...
```

#### Remove User from Kontena Platform

```
$ kontena cloud platform user remove <USERNAME1> ...
```

## Managing Users with Custom Kontena Platforms

> This section is for people using the custom Kontena Platform deployments. If you are using Kontena Cloud and hosted Kontena Platform deployments, please see [Managing Users with Kontena Cloud](#managing-users-with-kontena-cloud) section above.

Custom Kontena Platform deployments use built-in user management. The first user that logs in to Kontena Platform Master will be assigned to the `master_admin` role. The master admin can invite new users to the Kontena Platform Master and assign users to the `master_admin` or `grid_admin` roles. Here's the breakdown of roles:

**master_admin**
* can invite users to Kontena Platform Master and manage their roles
* can manage all Kontena Platform Grids, Kontena Platform Grid users and their users
* all `grid_admin` permissions for all Kontena Platform Grids

**users_admin**
* Invite and remove users
* Manage Kontena Platform Grid users (only users own Kontena Platform Grids)

**grid_admin**
* manage grid (update)
* can manage Kontena Platform Grid users
* manage Kontena Platform Grid host nodes (create, reset tokens)
* all Kontena Platform Grid user permissions

**user**
* can only operate within a Kontena Platform Grid

Please note, the role `user` is automatically assigned to any user added to a Kontena Platform Grid using the [Add User to Grid](users#add-user-to-grid) command. There is no need to assign the role explicitly in this case.

**Manage Kontena Platform Master Users**

* [List Kontena Platform Master Users](#list-kontena-platform-master-users)
* [Add User to Kontena Platform Master](#add-user-to-kontena-platform-master)
* [Remove User from Kontena Platform Master](#remove-user-from-kontena-platform-master)
* [Add User Role to Kontena Platform Master](#add-user-role-to-kontena-platform-master)
* [Remove User Role from Kontena Platform Master](#remove-user-role-from-custom-kontena-platform)

**Manage Kontena Platform Grid Users**

* [List Kontena Platform Grid Users](#list-kontena-platform-grid-users)
* [Add User to Kontena Platform Grid](#add-user-to-kontena-platform-grid)
* [Remove User from Kontena Platform Grid](#remove-user-from-kontena-platform-grid)

#### List Kontena Platform Master Users

```
$ kontena master user list
```

#### Add User to Kontena Platform Master

```
$ kontena master user invite <email>
```

#### Remove User from Kontena Platform Master

```
$ kontena master user remove <email>
```

#### Add User Role to Kontena Platform Master

```
$ kontena master user role add <role> <email>
```

#### Remove User Role from Kontena Platform Master

```
$ kontena master user role remove <role> <email>
```

#### List Kontena Platform Grid Users

```
$ kontena grid user list
```

#### Add User to Kontena Platform Grid

```
$ kontena grid user invite <email>
```

#### Remove User from Kontena Platform Grid

```
$ kontena grid user remove <email>
```
