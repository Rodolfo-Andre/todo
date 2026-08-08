using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Users.Commands.ChangeRole;

public class ChangeRoleHandler : IRequestHandler<ChangeRoleCommand, BaseResponse<bool>>
{
    private readonly UserManager<User> _userManager;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILocalizer _localizer;

    public ChangeRoleHandler(UserManager<User> userManager, ICurrentUserService currentUserService, ILocalizer localizer)
    {
        _userManager = userManager;
        _currentUserService = currentUserService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<bool>> Handle(ChangeRoleCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.UserId.ToString());

        if (user == null)
        {
            return BaseResponse<bool>.Failure(_localizer.Get("UserNotFound"));
        }

        // Get current roles
        var currentRoles = await _userManager.GetRolesAsync(user);

        // Remove all current roles
        if (currentRoles.Any())
        {
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
        }

        // Add new role
        var result = await _userManager.AddToRoleAsync(user, request.Role);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BaseResponse<bool>.Failure(errors);
        }

        return BaseResponse<bool>.CreateSuccess(true);
    }
}
