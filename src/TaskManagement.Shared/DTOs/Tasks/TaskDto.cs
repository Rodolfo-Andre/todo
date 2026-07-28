namespace TaskManagement.Shared.DTOs.Tasks;

public class TaskDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string ProjectKey { get; set; } = string.Empty;
    public Guid? AssignedToId { get; set; }
    public string? AssignedToName { get; set; }
    public Guid CreatedById { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
    public int Status { get; set; }
    public int Priority { get; set; }
    public int? StoryPoints { get; set; }
    public DateTime? DueDate { get; set; }
    public int OrderIndex { get; set; }
    public string? Tags { get; set; }
    public int CommentCount { get; set; }
    public int AttachmentCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class TaskDetailDto : TaskDto
{
    public List<TaskCommentDto> Comments { get; set; } = new();
    public List<TaskAttachmentDto> Attachments { get; set; } = new();
    public List<TaskHistoryDto> Histories { get; set; } = new();
}

public class TaskCommentDto
{
    public Guid Id { get; set; }
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserFullName { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class TaskAttachmentDto
{
    public Guid Id { get; set; }
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public long FileSize { get; set; }
    public string ContentType { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class TaskHistoryDto
{
    public Guid Id { get; set; }
    public Guid TaskId { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string? OldValue { get; set; }
    public string? NewValue { get; set; }
    public DateTime CreatedAt { get; set; }
}
