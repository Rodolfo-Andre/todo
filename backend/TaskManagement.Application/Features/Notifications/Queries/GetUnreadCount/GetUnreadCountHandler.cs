using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Notifications.Queries.GetUnreadCount;

public class GetUnreadCountHandler : IRequestHandler<GetUnreadCountQuery, BaseResponse<int>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public GetUnreadCountHandler(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<int>> Handle(
        GetUnreadCountQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return new BaseResponse<int>
            {
                Success = false,
                Message = "User not authenticated"
            };
        }

        var currentUserId = Guid.Parse(userId);
        var count = await _unitOfWork.Notifications.CountAsync(
            n => n.UserId == currentUserId && !n.IsRead,
            cancellationToken);

        return new BaseResponse<int>
        {
            Success = true,
            Message = "Unread count retrieved successfully",
            Data = count
        };
    }
}
