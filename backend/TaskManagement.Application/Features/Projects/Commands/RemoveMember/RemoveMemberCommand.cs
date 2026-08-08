using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Commands.RemoveMember;

public class RemoveMemberCommand : IRequest<BaseResponse<bool>>
{
    public Guid ProjectId { get; set; }
    public Guid UserId { get; set; }
}
