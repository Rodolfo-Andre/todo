namespace TaskManagement.Domain.Entities;

public class TaskAttachment : AuditableEntity
{
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;

    public TaskItem Task { get; set; } = null!;
    public User User { get; set; } = null!;
}
