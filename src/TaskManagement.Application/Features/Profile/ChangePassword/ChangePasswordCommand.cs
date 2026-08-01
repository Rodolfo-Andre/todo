using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Profile.ChangePassword;

public class ChangePasswordCommand : IRequest<BaseResponse<bool>>
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}
