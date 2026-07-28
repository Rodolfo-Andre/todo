namespace TaskManagement.Shared.DTOs.Projects;

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Key { get; set; } = string.Empty;
    public Guid OwnerId { get; set; }
    public string OwnerName { get; set; } = string.Empty;
    public int Status { get; set; }
    public int TaskCount { get; set; }
    public int MemberCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
