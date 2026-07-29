using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Commands.MarkAsRead;

public class MarkAsReadCommand : IRequest<BaseResponse<bool>>
{
    public Guid NotificationId { get; set; }
}
