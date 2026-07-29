using MediatR;
using TaskManagement.Shared.DTOs.Notifications;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Queries.GetNotificationsByUser;

public class GetNotificationsByUserQuery : IRequest<BaseResponse<List<NotificationDto>>>
{
    public bool? IsRead { get; set; }
    public int? Limit { get; set; }
}
