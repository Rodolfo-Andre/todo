using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Users.Commands.ChangeRole;

public class ChangeRoleCommand : IRequest<BaseResponse<bool>>
{
    public Guid UserId { get; set; }
    public string Role { get; set; } = string.Empty;
}
