using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Constants;
using TaskManagement.Shared.DTOs.Auth;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Auth.Commands.Register;

public class RegisterHandler : IRequestHandler<RegisterCommand, BaseResponse<AuthResponse>>
{
    private readonly UserManager<User> _userManager;
    private readonly IJwtTokenService _jwtTokenService;

    public RegisterHandler(UserManager<User> userManager, IJwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<BaseResponse<AuthResponse>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Check if email already exists
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return BaseResponse<AuthResponse>.Failure("Email already exists");
        }

        // Check if username already exists
        var existingUserName = await _userManager.FindByNameAsync(request.UserName);
        if (existingUserName != null)
        {
            return BaseResponse<AuthResponse>.Failure("Username already exists");
        }

        var user = new User
        {
            UserName = request.UserName,
            Email = request.Email,
            FullName = request.FullName,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = "System"
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BaseResponse<AuthResponse>.Failure(errors);
        }

        // Assign default role
        await _userManager.AddToRoleAsync(user, RoleConstants.Developer);

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
