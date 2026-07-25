namespace TaskManagement.Shared.Constants;

public static class Permissions
{
    public static class Projects
    {
        public const string Create = "permissions.projects.create";
        public const string Read = "permissions.projects.read";
        public const string Update = "permissions.projects.update";
        public const string Delete = "permissions.projects.delete";
        public const string ManageMembers = "permissions.projects.manage_members";
    }

    public static class Tasks
    {
        public const string Create = "permissions.tasks.create";
        public const string Read = "permissions.tasks.read";
        public const string Update = "permissions.tasks.update";
        public const string Delete = "permissions.tasks.delete";
        public const string Assign = "permissions.tasks.assign";
    }

    public static class Admin
    {
        public const string ManageUsers = "permissions.admin.manage_users";
        public const string ViewAudit = "permissions.admin.view_audit";
        public const string ManageSettings = "permissions.admin.manage_settings";
    }
}
