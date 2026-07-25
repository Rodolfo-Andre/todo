using Microsoft.AspNetCore.Identity;

namespace TaskManagement.Domain.Entities;

public class Role : IdentityRole<Guid>
{
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
}
