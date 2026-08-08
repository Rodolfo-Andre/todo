using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Notifications;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Queries.GetNotificationsByUser;

public class GetNotificationsByUserHandler : IRequestHandler<GetNotificationsByUserQuery, BaseResponse<List<NotificationDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILocalizer _localizer;

    public GetNotificationsByUserHandler(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService,
        ILocalizer localizer)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<List<NotificationDto>>> Handle(
        GetNotificationsByUserQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return new BaseResponse<List<NotificationDto>>
            {
                Success = false,
                Message = _localizer.Get("UserNotAuthenticated")
            };
        }

        var currentUserId = Guid.Parse(userId);

        var notifications = await _unitOfWork.Notifications.FindAsync(
            n => n.UserId == currentUserId,
            cancellationToken);

        // Filter by read status if specified
        if (request.IsRead.HasValue)
        {
            notifications = notifications.Where(n => n.IsRead == request.IsRead.Value).ToList();
        }

        // Order by date and limit
        var orderedNotifications = notifications
            .OrderByDescending(n => n.CreatedAt)
            .Take(request.Limit ?? 50)
            .ToList();

        var dtoList = orderedNotifications.Select(MapToDto).ToList();

        return new BaseResponse<List<NotificationDto>>
        {
            Success = true,
            Message = _localizer.Get("NotificationsRetrieved"),
            Data = dtoList
        };
    }

    private static NotificationDto MapToDto(Notification notification)
    {
        var typeNames = new Dictionary<int, string>
        {
            { 0, "TaskAssigned" },
            { 1, "TaskUpdated" },
            { 2, "TaskStatusChanged" },
            { 3, "CommentAdded" },
            { 4, "ProjectUpdated" }
        };

        return new NotificationDto
        {
            Id = notification.Id,
            UserId = notification.UserId,
            Title = notification.Title,
            Message = notification.Message,
            Type = notification.Type,
            TypeName = typeNames.GetValueOrDefault(notification.Type, "Unknown"),
            ReferenceId = notification.ReferenceId,
            ReferenceType = notification.ReferenceType,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };
    }
}
