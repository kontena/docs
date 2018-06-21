# Managing Users

Kontena Platform deployments use built-in user management. The first user that logs in to Kontena Platform Master will be assigned to the `master_admin` role. The master admin can invite new users to the Kontena Platform Master and assign users to the `master_admin` or `grid_admin` roles. Here's the breakdown of roles:

**master_admin**
* can invite users to Kontena Platform Master and manage their roles
* can manage all Kontena Platform Grids, Kontena Platform Grid users and their users
* all `grid_admin` permissions for all Kontena Platform Grids

**users_admin**
* Invite and remove users
* Manage Kontena Platform Grid users (only user's own Kontena Platform Grids)

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
