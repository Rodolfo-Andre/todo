using MediatR;
using TaskManagement.Shared.DTOs.Notifications;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Commands.CreateNotification;

public class CreateNotificationCommand : IRequest<BaseResponse<NotificationDto>>
{
    public Guid UserId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public int Type { get; set; }
    public Guid? ReferenceId { get; set; }
    public string? ReferenceType { get; set; }
}
