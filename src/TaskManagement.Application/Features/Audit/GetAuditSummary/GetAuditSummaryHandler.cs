using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Audit;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Audit.GetAuditSummary;

public class GetAuditSummaryHandler : IRequestHandler<GetAuditSummaryQuery, BaseResponse<AuditLogSummaryDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAuditSummaryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseResponse<AuditLogSummaryDto>> Handle(
        GetAuditSummaryQuery request,
        CancellationToken cancellationToken)
    {
        var today = DateTime.UtcNow.Date;

        var totalLogs = await _unitOfWork.AuditLogs.CountAsync(x => true, cancellationToken);
        var todayLogs = await _unitOfWork.AuditLogs.CountAsync(x => x.CreatedAt >= today, cancellationToken);

        var last30Days = DateTime.UtcNow.AddDays(-30);
        var allLogs = await _unitOfWork.AuditLogs.FindAsync(x => x.CreatedAt >= last30Days, cancellationToken);

        var recentLogs = allLogs
            .OrderByDescending(x => x.CreatedAt)
            .Take(10)
            .ToList();

        // Get user names for recent logs
        var userIds = recentLogs.Where(x => x.UserId.HasValue).Select(x => x.UserId!.Value).Distinct().ToList();
        var users = new Dictionary<Guid, string>();

        foreach (var userId in userIds)
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId, cancellationToken);
            if (user != null)
            {
                users[userId] = user.FullName;
            }
        }

        var recentLogDtos = recentLogs.Select(log => new AuditLogDto
        {
            Id = log.Id,
            UserId = log.UserId,
            UserName = log.UserId.HasValue && users.ContainsKey(log.UserId.Value)
                ? users[log.UserId.Value]
                : null,
            Action = log.Action,
            EntityName = log.EntityName,
            EntityId = log.EntityId,
            CreatedAt = log.CreatedAt
        }).ToList();

        var logsByAction = allLogs
            .GroupBy(x => x.Action)
            .ToDictionary(g => g.Key, g => g.Count());

        var logsByEntity = allLogs
            .GroupBy(x => x.EntityName)
            .ToDictionary(g => g.Key, g => g.Count());

        var summary = new AuditLogSummaryDto
        {
            TotalLogs = totalLogs,
            TodayLogs = todayLogs,
            LogsByAction = logsByAction,
            LogsByEntity = logsByEntity,
            RecentLogs = recentLogDtos
        };

        return new BaseResponse<AuditLogSummaryDto>
        {
            Success = true,
            Message = "Audit summary retrieved successfully",
            Data = summary
        };
    }
}
