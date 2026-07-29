using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Notifications.Commands.CreateNotification;
using TaskManagement.Application.Features.Notifications.Commands.DeleteNotification;
using TaskManagement.Application.Features.Notifications.Commands.MarkAllAsRead;
using TaskManagement.Application.Features.Notifications.Commands.MarkAsRead;
using TaskManagement.Application.Features.Notifications.Queries.GetNotificationsByUser;
using TaskManagement.Application.Features.Notifications.Queries.GetUnreadCount;
using TaskManagement.Shared.DTOs.Notifications;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly IMediator _mediator;

    public NotificationsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] bool? isRead, [FromQuery] int? limit)
    {
        var query = new GetNotificationsByUserQuery
        {
            IsRead = isRead,
            Limit = limit
        };
        var result = await _mediator.Send(query);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var query = new GetUnreadCountQuery();
        var result = await _mediator.Send(query);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationRequest request)
    {
        var command = new CreateNotificationCommand
        {
            UserId = request.UserId,
            Title = request.Title,
            Message = request.Message,
            Type = request.Type,
            ReferenceId = request.ReferenceId,
            ReferenceType = request.ReferenceType
        };
        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPatch("{id}/read")]
    public async Task<IActionResult> MarkAsRead(Guid id)
    {
        var command = new MarkAsReadCommand { NotificationId = id };
        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var command = new MarkAllAsReadCommand();
        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(Guid id)
    {
        var command = new DeleteNotificationCommand { NotificationId = id };
        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }
}
