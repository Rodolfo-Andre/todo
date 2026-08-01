using MediatR;
using TaskManagement.Shared.DTOs.Audit;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Audit.GetAuditSummary;

public class GetAuditSummaryQuery : IRequest<BaseResponse<AuditLogSummaryDto>>
{
}
