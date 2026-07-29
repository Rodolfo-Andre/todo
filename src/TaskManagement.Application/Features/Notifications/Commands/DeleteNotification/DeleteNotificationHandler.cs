using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Commands.DeleteNotification;

public class DeleteNotificationHandler : IRequestHandler<DeleteNotificationCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteNotificationHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseResponse<bool>> Handle(
        DeleteNotificationCommand request,
        CancellationToken cancellationToken)
    {
        var notification = await _unitOfWork.Notifications.GetByIdAsync(request.NotificationId, cancellationToken);
        if (notification == null)
        {
            return new BaseResponse<bool>
            {
                Success = false,
                Message = "Notification not found"
            };
        }

        _unitOfWork.Notifications.Delete(notification);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new BaseResponse<bool>
        {
            Success = true,
            Message = "Notification deleted successfully",
            Data = true
        };
    }
}
