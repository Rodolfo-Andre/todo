using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.DeleteTask;

public class DeleteTaskCommand : IRequest<BaseResponse<bool>>
{
    public Guid Id { get; set; }
}
