using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Commands.MarkAllAsRead;

public class MarkAllAsReadCommand : IRequest<BaseResponse<bool>>
{
}
