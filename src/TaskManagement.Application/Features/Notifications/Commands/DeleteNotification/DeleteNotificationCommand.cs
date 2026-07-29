using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Commands.DeleteNotification;

public class DeleteNotificationCommand : IRequest<BaseResponse<bool>>
{
    public Guid NotificationId { get; set; }
}
