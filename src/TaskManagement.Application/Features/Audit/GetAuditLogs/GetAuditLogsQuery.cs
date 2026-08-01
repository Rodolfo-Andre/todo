using MediatR;
using TaskManagement.Shared.DTOs.Audit;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Audit.GetAuditLogs;

public class GetAuditLogsQuery : IRequest<BaseResponse<List<AuditLogDto>>>
{
    public string? Action { get; set; }
    public string? EntityName { get; set; }
    public Guid? UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
