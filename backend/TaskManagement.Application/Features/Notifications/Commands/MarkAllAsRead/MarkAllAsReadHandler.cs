using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Commands.MarkAllAsRead;

public class MarkAllAsReadHandler : IRequestHandler<MarkAllAsReadCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public MarkAllAsReadHandler(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<bool>> Handle(
        MarkAllAsReadCommand request,
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

        var currentUserId = Guid.Parse(userId);
        var notifications = await _unitOfWork.Notifications.FindAsync(
            n => n.UserId == currentUserId && !n.IsRead,
            cancellationToken);

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            _unitOfWork.Notifications.Update(notification);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new BaseResponse<bool>
        {
            Success = true,
            Message = "All notifications marked as read",
            Data = true
        };
    }
}
