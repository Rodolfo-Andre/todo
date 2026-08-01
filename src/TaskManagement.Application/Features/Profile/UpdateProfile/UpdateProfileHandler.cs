using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Profile.UpdateProfile;

public class UpdateProfileHandler : IRequestHandler<UpdateProfileCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly UserManager<User> _userManager;

    public UpdateProfileHandler(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService,
        UserManager<User> userManager)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _userManager = userManager;
    }

    public async Task<BaseResponse<bool>> Handle(
        UpdateProfileCommand request,
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

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return new BaseResponse<bool>
            {
                Success = false,
                Message = "User not found"
            };
        }

        // Check if email is already taken by another user
        if (user.Email != request.Email)
        {
            var existingUser = await _userManager.FindByEmailAsync(request.Email);
            if (existingUser != null && existingUser.Id != user.Id)
            {
                return new BaseResponse<bool>
                {
                    Success = false,
                    Message = "Email is already taken"
                };
            }
        }

        user.FullName = request.FullName;
        user.Email = request.Email;
        user.UserName = request.Email; // Keep username in sync with email
        user.AvatarUrl = request.AvatarUrl;
        user.UpdatedAt = DateTime.UtcNow;

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            return new BaseResponse<bool>
            {
                Success = false,
                Message = "Failed to update profile",
                Errors = result.Errors.Select(e => e.Description).ToList()
            };
        }

        return new BaseResponse<bool>
        {
            Success = true,
            Message = "Profile updated successfully",
            Data = true
        };
    }
}
