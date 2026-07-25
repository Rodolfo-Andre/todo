using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Constants;

namespace TaskManagement.Infrastructure.Data.Seeds;

public static class RoleSeed
{
    public static async Task SeedAsync(AppDbContext context, RoleManager<Role> roleManager)
    {
        if (await context.Roles.AnyAsync())
        {
            return;
        }

        var roles = new List<Role>
        {
            new Role
            {
                Name = RoleConstants.Admin,
                NormalizedName = RoleConstants.Admin.ToUpper(),
                Description = "Administrator with full access",
                CreatedAt = DateTime.UtcNow
            },
            new Role
            {
                Name = RoleConstants.ProjectManager,
                NormalizedName = RoleConstants.ProjectManager.ToUpper(),
                Description = "Project manager with project-level access",
                CreatedAt = DateTime.UtcNow
            },
            new Role
            {
                Name = RoleConstants.Developer,
                NormalizedName = RoleConstants.Developer.ToUpper(),
                Description = "Developer with task-level access",
                CreatedAt = DateTime.UtcNow
            },
            new Role
            {
                Name = RoleConstants.Viewer,
                NormalizedName = RoleConstants.Viewer.ToUpper(),
                Description = "Viewer with read-only access",
                CreatedAt = DateTime.UtcNow
            }
        };

        foreach (var role in roles)
        {
            await roleManager.CreateAsync(role);
        }
    }
}
