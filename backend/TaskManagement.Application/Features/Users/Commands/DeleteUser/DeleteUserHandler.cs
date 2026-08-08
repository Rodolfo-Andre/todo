using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Users.Commands.DeleteUser;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, BaseResponse<bool>>
{
    private readonly UserManager<User> _userManager;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILocalizer _localizer;

    public DeleteUserHandler(UserManager<User> userManager, ICurrentUserService currentUserService, ILocalizer localizer)
    {
        _userManager = userManager;
        _currentUserService = currentUserService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<bool>> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());

        if (user == null)
        {
            return BaseResponse<bool>.Failure(_localizer.Get("UserNotFound"));
        }

        // Prevent deleting yourself
        if (user.Id.ToString() == _currentUserService.UserId)
        {
            return BaseResponse<bool>.Failure(_localizer.Get("CannotDeleteOwnAccount"));
        }

        // Soft delete
        user.DeletedAt = DateTime.UtcNow;
        user.DeletedBy = _currentUserService.UserId;
        user.IsActive = false;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return BaseResponse<bool>.Failure(errors);
        }

        return BaseResponse<bool>.CreateSuccess(true);
    }
}
