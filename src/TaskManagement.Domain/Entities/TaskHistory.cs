namespace TaskManagement.Domain.Entities;

public class TaskHistory : BaseEntity
{
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public DateTime CreatedAt { get; set; }

    public TaskItem Task { get; set; } = null!;
    public User User { get; set; } = null!;
}
