using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Profile.ChangePassword;

public class ChangePasswordHandler : IRequestHandler<ChangePasswordCommand, BaseResponse<bool>>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly UserManager<User> _userManager;

    public ChangePasswordHandler(
        ICurrentUserService currentUserService,
        UserManager<User> userManager)
    {
        _currentUserService = currentUserService;
        _userManager = userManager;
    }

    public async Task<BaseResponse<bool>> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return new BaseResponse<bool>
            {
                Success = false,
                Message = "User not authenticated"
            };
        }

        // Validate passwords match
        if (request.NewPassword != request.ConfirmPassword)
        {
            return new BaseResponse<bool>
            {
                Success = false,
                Message = "New password and confirmation do not match"
            };
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return new BaseResponse<bool>
            {
                Success = false,
                Message = "User not found"
            };
        }

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        if (!result.Succeeded)
        {
            return new BaseResponse<bool>
            {
                Success = false,
                Message = "Failed to change password",
                Errors = result.Errors.Select(e => e.Description).ToList()
            };
        }

        return new BaseResponse<bool>
        {
            Success = true,
            Message = "Password changed successfully",
            Data = true
        };
    }
}
