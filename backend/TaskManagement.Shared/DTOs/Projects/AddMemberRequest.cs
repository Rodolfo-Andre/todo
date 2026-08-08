namespace TaskManagement.Shared.DTOs.Projects;

public class AddMemberRequest
{
    public Guid UserId { get; set; }
    public int ProjectRole { get; set; } = 1; // Member by default
}
