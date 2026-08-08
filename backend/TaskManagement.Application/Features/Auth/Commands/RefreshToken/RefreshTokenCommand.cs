using MediatR;
using TaskManagement.Shared.DTOs.Auth;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Auth.Commands.RefreshToken;

public class RefreshTokenCommand : IRequest<BaseResponse<AuthResponse>>
{
    public string RefreshToken { get; set; } = string.Empty;
}
