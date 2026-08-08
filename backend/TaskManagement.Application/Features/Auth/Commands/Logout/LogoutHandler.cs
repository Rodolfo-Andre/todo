using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Auth.Commands.Logout;

public class LogoutHandler : IRequestHandler<LogoutCommand, BaseResponse<bool>>
{
    private readonly UserManager<User> _userManager;
    private readonly ICurrentUserService _currentUserService;

    public LogoutHandler(UserManager<User> userManager, ICurrentUserService currentUserService)
    {
        _userManager = userManager;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<bool>> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(_currentUserService.UserId);

        if (user == null)
        {
            return BaseResponse<bool>.Failure("User not found");
        }

        // Clear refresh token
        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        await _userManager.UpdateAsync(user);

        return BaseResponse<bool>.CreateSuccess(true);
    }
}
