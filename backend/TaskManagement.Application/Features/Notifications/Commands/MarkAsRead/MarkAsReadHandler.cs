using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Commands.MarkAsRead;

public class MarkAsReadHandler : IRequestHandler<MarkAsReadCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILocalizer _localizer;

    public MarkAsReadHandler(
        IUnitOfWork unitOfWork,
        ILocalizer localizer)
    {
        _unitOfWork = unitOfWork;
        _localizer = localizer;
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
                Message = _localizer.Get("NotificationNotFound")
            };
        }

        notification.IsRead = true;
        _unitOfWork.Notifications.Update(notification);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new BaseResponse<bool>
        {
            Success = true,
            Message = _localizer.Get("NotificationMarkedAsRead"),
            Data = true
        };
    }
}
