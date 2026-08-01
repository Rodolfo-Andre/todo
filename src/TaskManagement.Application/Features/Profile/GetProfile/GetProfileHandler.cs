using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Profile;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Profile.GetProfile;

public class GetProfileHandler : IRequestHandler<GetProfileQuery, BaseResponse<ProfileDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly UserManager<User> _userManager;

    public GetProfileHandler(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService,
        UserManager<User> userManager)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _userManager = userManager;
    }

    public async Task<BaseResponse<ProfileDto>> Handle(
        GetProfileQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return new BaseResponse<ProfileDto>
            {
                Success = false,
                Message = "User not authenticated"
            };
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
        {
            return new BaseResponse<ProfileDto>
            {
                Success = false,
                Message = "User not found"
            };
        }

        var roles = await _userManager.GetRolesAsync(user);

        var profile = new ProfileDto
        {
            Id = user.Id,
            UserName = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive,
            Roles = roles.ToList(),
            CreatedAt = user.CreatedAt
        };

        return new BaseResponse<ProfileDto>
        {
            Success = true,
            Message = "Profile retrieved successfully",
            Data = profile
        };
    }
}
