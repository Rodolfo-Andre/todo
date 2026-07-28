using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Commands.AddMember;

public class AddMemberCommand : IRequest<BaseResponse<bool>>
{
    public Guid ProjectId { get; set; }
    public Guid UserId { get; set; }
    public int ProjectRole { get; set; } = 1; // Member by default
}
