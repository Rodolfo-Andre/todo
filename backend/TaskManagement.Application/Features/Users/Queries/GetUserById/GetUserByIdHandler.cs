using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Users;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Users.Queries.GetUserById;

public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, BaseResponse<UserDto>>
{
    private readonly UserManager<User> _userManager;
    private readonly ILocalizer _localizer;

    public GetUserByIdHandler(UserManager<User> userManager, ILocalizer localizer)
    {
        _userManager = userManager;
        _localizer = localizer;
    }

    public async Task<BaseResponse<UserDto>> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());

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
            Roles = roles.ToList(),
            CreatedAt = user.CreatedAt
        };

        return BaseResponse<UserDto>.CreateSuccess(userDto);
    }
}
