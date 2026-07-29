using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Commands.MarkAsRead;

public class MarkAsReadHandler : IRequestHandler<MarkAsReadCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public MarkAsReadHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseResponse<bool>> Handle(
        MarkAsReadCommand request,
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

        notification.IsRead = true;
        _unitOfWork.Notifications.Update(notification);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new BaseResponse<bool>
        {
            Success = true,
            Message = "Notification marked as read",
            Data = true
        };
    }
}
