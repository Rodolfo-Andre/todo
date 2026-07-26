using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Users;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Users.Queries.GetUsers;

public class GetUsersHandler : IRequestHandler<GetUsersQuery, BaseResponse<List<UserDto>>>
{
    private readonly UserManager<User> _userManager;

    public GetUsersHandler(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public async Task<BaseResponse<List<UserDto>>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        var users = _userManager.Users.Where(u => !u.DeletedAt.HasValue).ToList();
        var userDtos = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userDtos.Add(new UserDto
            {
                Id = user.Id,
                UserName = user.UserName!,
                Email = user.Email!,
                FullName = user.FullName,
                AvatarUrl = user.AvatarUrl,
                IsActive = user.IsActive,
                Roles = roles.ToList(),
                CreatedAt = user.CreatedAt
            });
        }

        return BaseResponse<List<UserDto>>.CreateSuccess(userDtos);
    }
}
