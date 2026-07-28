using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.ChangeStatus;

public class ChangeStatusCommand : IRequest<BaseResponse<bool>>
{
    public Guid Id { get; set; }
    public int Status { get; set; }
}
