using MediatR;
using TaskManagement.Shared.DTOs.Tasks;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Queries.GetTaskById;

public class GetTaskByIdQuery : IRequest<BaseResponse<TaskDetailDto>>
{
    public Guid Id { get; set; }
}
