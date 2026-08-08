using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Constants;

namespace TaskManagement.Infrastructure.Data.Seeds;

public static class AdminUserSeed
{
    public static async Task SeedAsync(AppDbContext context, UserManager<User> userManager)
    {
        if (await context.Users.AnyAsync())
        {
            return;
        }

        var adminUser = new User
        {
            UserName = "admin@taskmanagement.com",
            Email = "admin@taskmanagement.com",
            FullName = "System Administrator",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        var result = await userManager.CreateAsync(adminUser, "Admin@123");

        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, RoleConstants.Admin);
        }
    }
}
