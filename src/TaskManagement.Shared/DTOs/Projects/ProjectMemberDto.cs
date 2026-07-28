namespace TaskManagement.Shared.DTOs.Projects;

public class ProjectMemberDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int ProjectRole { get; set; }
    public DateTime JoinedAt { get; set; }
}
