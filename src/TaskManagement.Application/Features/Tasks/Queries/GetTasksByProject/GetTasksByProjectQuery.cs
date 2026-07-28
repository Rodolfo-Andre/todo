using MediatR;
using TaskManagement.Shared.DTOs.Tasks;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Queries.GetTasksByProject;

public class GetTasksByProjectQuery : IRequest<BaseResponse<List<TaskDto>>>
{
    public Guid ProjectId { get; set; }
    public int? Status { get; set; }
    public int? Priority { get; set; }
    public string? Search { get; set; }
    public Guid? AssignedToId { get; set; }
}
