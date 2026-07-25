namespace TaskManagement.Domain.Entities;

public class TaskComment : AuditableEntity
{
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    public string Content { get; set; } = string.Empty;

    public TaskItem Task { get; set; } = null!;
    public User User { get; set; } = null!;
}
