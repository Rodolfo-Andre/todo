using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Profile.UpdateProfile;

public class UpdateProfileCommand : IRequest<BaseResponse<bool>>
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
}
