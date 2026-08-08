using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Auth;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Auth.Queries.GetCurrentUser;

public class GetCurrentUserHandler : IRequestHandler<GetCurrentUserQuery, BaseResponse<UserDto>>
{
    private readonly UserManager<User> _userManager;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILocalizer _localizer;

    public GetCurrentUserHandler(UserManager<User> userManager, ICurrentUserService currentUserService, ILocalizer localizer)
    {
        _userManager = userManager;
        _currentUserService = currentUserService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<UserDto>> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(_currentUserService.UserId);

        if (user == null)
        {
            return BaseResponse<UserDto>.Failure(_localizer.Get("UserNotFound"));
        }

        var roles = await _userManager.GetRolesAsync(user);

        var userDto = new UserDto
        {
            Id = user.Id,
            UserName = user.UserName!,
            Email = user.Email!,
            FullName = user.FullName,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive,
            Roles = roles.ToList()
        };

        return BaseResponse<UserDto>.CreateSuccess(userDto);
    }
}
