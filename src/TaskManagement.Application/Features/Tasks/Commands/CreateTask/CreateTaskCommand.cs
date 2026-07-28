using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.CreateTask;

public class CreateTaskCommand : IRequest<BaseResponse<Guid>>
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid ProjectId { get; set; }
    public Guid? AssignedToId { get; set; }
    public int Priority { get; set; } = 1;
    public int? StoryPoints { get; set; }
    public DateTime? DueDate { get; set; }
    public List<string>? Tags { get; set; }
}
