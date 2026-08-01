using System.Linq.Expressions;
using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Audit;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Audit.GetAuditLogs;

public class GetAuditLogsHandler : IRequestHandler<GetAuditLogsQuery, BaseResponse<List<AuditLogDto>>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAuditLogsHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseResponse<List<AuditLogDto>>> Handle(
        GetAuditLogsQuery request,
        CancellationToken cancellationToken)
    {
        Expression<Func<AuditLog, bool>> filter = x => true;

        if (!string.IsNullOrEmpty(request.Action))
            filter = x => x.Action == request.Action;

        if (!string.IsNullOrEmpty(request.EntityName))
            filter = x => x.EntityName == request.EntityName;

        if (request.UserId.HasValue)
            filter = x => x.UserId == request.UserId.Value;

        if (request.StartDate.HasValue)
            filter = x => x.CreatedAt >= request.StartDate.Value;

        if (request.EndDate.HasValue)
            filter = x => x.CreatedAt <= request.EndDate.Value.AddDays(1);

        var logs = await _unitOfWork.AuditLogs.GetAllAsync(
            filter,
            orderBy: x => x.OrderByDescending(y => y.CreatedAt),
            skip: (request.Page - 1) * request.PageSize,
            take: request.PageSize,
            cancellationToken: cancellationToken);

        var totalLogs = await _unitOfWork.AuditLogs.CountAsync(filter, cancellationToken);

        // Get user names for logs
        var userIds = logs.Where(x => x.UserId.HasValue).Select(x => x.UserId!.Value).Distinct().ToList();
        var users = new Dictionary<Guid, string>();

        foreach (var userId in userIds)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user != null)
            {
                users[userId] = user.FullName;
            }
        }

        var logDtos = logs.Select(log => new AuditLogDto
        {
            Id = log.Id,
            UserId = log.UserId,
            UserName = log.UserId.HasValue && users.ContainsKey(log.UserId.Value)
                ? users[log.UserId.Value]
                : null,
            Action = log.Action,
            EntityName = log.EntityName,
            EntityId = log.EntityId,
            OldValues = log.OldValues,
            NewValues = log.NewValues,
            IpAddress = log.IpAddress,
            UserAgent = log.UserAgent,
            CreatedAt = log.CreatedAt
        }).ToList();

        return new BaseResponse<List<AuditLogDto>>
        {
            Success = true,
            Message = "Audit logs retrieved successfully",
            Data = logDtos
        };
    }
}
