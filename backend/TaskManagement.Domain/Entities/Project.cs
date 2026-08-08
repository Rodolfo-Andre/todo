namespace TaskManagement.Domain.Entities;

public class Project : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Key { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public int Status { get; set; } = 0;

    public User Owner { get; set; } = null!;
    public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
