using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Auth;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Auth.Commands.RefreshToken;

public class RefreshTokenHandler : IRequestHandler<RefreshTokenCommand, BaseResponse<AuthResponse>>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly ILocalizer _localizer;

    public RefreshTokenHandler(UserManager<User> userManager, IJwtTokenService jwtTokenService, ILocalizer localizer)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<AuthResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        ClaimsPrincipal? principal;

        try
        {
            principal = _jwtTokenService.GetPrincipalFromExpiredToken(request.RefreshToken);
        }
        catch (Exception)
        {
            return BaseResponse<AuthResponse>.Failure(_localizer.Get("InvalidRefreshToken"));
        }

        if (principal == null)
        {
            return BaseResponse<AuthResponse>.Failure(_localizer.Get("InvalidRefreshToken"));
        }

        var userId = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
        {
            return BaseResponse<AuthResponse>.Failure(_localizer.Get("InvalidRefreshToken"));
        }

        var user = await _userManager.FindByIdAsync(userId);

        if (user == null)
        {
            return BaseResponse<AuthResponse>.Failure(_localizer.Get("UserNotFound"));
        }

        if (user.RefreshToken != request.RefreshToken || user.RefreshTokenExpiry <= DateTime.UtcNow)
        {
            return BaseResponse<AuthResponse>.Failure(_localizer.Get("InvalidOrExpiredRefreshToken"));
        }

        var roles = await _userManager.GetRolesAsync(user);
        var newAccessToken = _jwtTokenService.GenerateAccessToken(user, roles);
        var newRefreshToken = _jwtTokenService.GenerateRefreshToken();

        // Update refresh token
        user.RefreshToken = newRefreshToken;
        user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
        await _userManager.UpdateAsync(user);

        var response = new AuthResponse
        {
            AccessToken = newAccessToken,
            RefreshToken = newRefreshToken,
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
