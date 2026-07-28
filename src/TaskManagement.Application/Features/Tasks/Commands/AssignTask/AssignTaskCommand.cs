using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.AssignTask;

public class AssignTaskCommand : IRequest<BaseResponse<bool>>
{
    public Guid Id { get; set; }
    public Guid? AssignedToId { get; set; }
}
