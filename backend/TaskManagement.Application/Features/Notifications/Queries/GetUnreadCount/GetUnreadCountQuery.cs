using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Queries.GetUnreadCount;

public class GetUnreadCountQuery : IRequest<BaseResponse<int>>
{
}
