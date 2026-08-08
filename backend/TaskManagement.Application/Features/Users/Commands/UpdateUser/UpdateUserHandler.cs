using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Users.Commands.UpdateUser;

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, BaseResponse<bool>>
{
    private readonly UserManager<User> _userManager;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILocalizer _localizer;

    public UpdateUserHandler(UserManager<User> userManager, ICurrentUserService currentUserService, ILocalizer localizer)
    {
        _userManager = userManager;
        _currentUserService = currentUserService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<bool>> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());

        if (user == null)
        {
            return BaseResponse<bool>.Failure(_localizer.Get("UserNotFound"));
        }

        // Check if email is already taken by another user
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null && existingUser.Id != request.Id)
        {
            return BaseResponse<bool>.Failure(_localizer.Get("EmailAlreadyTakenByAnother"));
        }

        user.FullName = request.FullName;
        user.Email = request.Email;
        user.EmailConfirmed = true;
        user.AvatarUrl = request.AvatarUrl;
        user.IsActive = request.IsActive;
        user.UpdatedAt = DateTime.UtcNow;
        user.UpdatedBy = _currentUserService.UserId;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BaseResponse<bool>.Failure(errors);
        }

        return BaseResponse<bool>.CreateSuccess(true);
    }
}
