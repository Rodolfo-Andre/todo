namespace TaskManagement.Shared.DTOs.Tasks;

public class UpdateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Priority { get; set; }
    public int? StoryPoints { get; set; }
    public DateTime? DueDate { get; set; }
    public List<string>? Tags { get; set; }
}
