using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Notifications;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Commands.CreateNotification;

public class CreateNotificationHandler : IRequestHandler<CreateNotificationCommand, BaseResponse<NotificationDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateNotificationHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseResponse<NotificationDto>> Handle(
        CreateNotificationCommand request,
        CancellationToken cancellationToken)
    {
        var notification = new Notification
        {
            UserId = request.UserId,
            Title = request.Title,
            Message = request.Message,
            Type = request.Type,
            ReferenceId = request.ReferenceId,
            ReferenceType = request.ReferenceType,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Notifications.AddAsync(notification, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = MapToDto(notification);

        return new BaseResponse<NotificationDto>
        {
            Success = true,
            Message = "Notification created successfully",
            Data = dto
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
