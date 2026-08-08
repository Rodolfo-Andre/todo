using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Auth;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Auth.Commands.Login;

public class LoginHandler : IRequestHandler<LoginCommand, BaseResponse<AuthResponse>>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILocalizer _localizer;

    public LoginHandler(UserManager<User> userManager, IJwtTokenService jwtTokenService, ILocalizer localizer)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<AuthResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null)
        {
            return BaseResponse<AuthResponse>.Failure(_localizer.Get("LoginFailed"));
        }

        if (!user.IsActive)
        {
            return BaseResponse<AuthResponse>.Failure(_localizer.Get("AccountDeactivated"));
        }

        var isValidPassword = await _userManager.CheckPasswordAsync(user, request.Password);

        if (!isValidPassword)
        {
            return BaseResponse<AuthResponse>.Failure(_localizer.Get("LoginFailed"));
        }

        var roles = await _userManager.GetRolesAsync(user);
        var accessToken = _jwtTokenService.GenerateAccessToken(user, roles);
        var refreshToken = _jwtTokenService.GenerateRefreshToken();

        // Save refresh token
        user.RefreshToken = refreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        var response = new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            User = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                IsActive = user.IsActive,
                Roles = roles.ToList()
            }
        };

        return BaseResponse<AuthResponse>.CreateSuccess(response);
    }
}
