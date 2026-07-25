using MediatR;
using TaskManagement.Shared.DTOs.Auth;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Auth.Commands.Register;

public class RegisterCommand : IRequest<BaseResponse<AuthResponse>>
{
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
}
