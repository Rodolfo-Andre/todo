namespace TaskManagement.Domain.Entities;

public class TaskItem : AuditableEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid ProjectId { get; set; }
    public Guid? AssignedToId { get; set; }
    public Guid CreatedById { get; set; }
    public int Status { get; set; } = 0;
    public int Priority { get; set; } = 1;
    public int? StoryPoints { get; set; }
    public DateTime? DueDate { get; set; }
    public int OrderIndex { get; set; }
    public string? Tags { get; set; }

    public Project Project { get; set; } = null!;
    public User? AssignedTo { get; set; }
    public User CreatedByUser { get; set; } = null!;
    public ICollection<TaskComment> Comments { get; set; } = new List<TaskComment>();
    public ICollection<TaskAttachment> Attachments { get; set; } = new List<TaskAttachment>();
    public ICollection<TaskHistory> Histories { get; set; } = new List<TaskHistory>();
}
