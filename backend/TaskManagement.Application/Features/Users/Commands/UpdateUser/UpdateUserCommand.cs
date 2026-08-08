using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Users.Commands.UpdateUser;

public class UpdateUserCommand : IRequest<BaseResponse<bool>>
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
}
