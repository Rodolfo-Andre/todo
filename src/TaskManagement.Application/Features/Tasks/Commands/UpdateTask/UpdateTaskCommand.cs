using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.UpdateTask;

public class UpdateTaskCommand : IRequest<BaseResponse<bool>>
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Priority { get; set; }
    public int? StoryPoints { get; set; }
    public DateTime? DueDate { get; set; }
    public List<string>? Tags { get; set; }
}
