using MediatR;
using TaskManagement.Shared.DTOs.Tasks;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Queries.GetMyTasks;

public class GetMyTasksQuery : IRequest<BaseResponse<List<TaskDto>>>
{
    public int? Status { get; set; }
    public int? Priority { get; set; }
    public string? Search { get; set; }
}
