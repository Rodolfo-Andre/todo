using MediatR;
using TaskManagement.Shared.DTOs.Dashboard;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Dashboard.GetDashboardData;

public class GetDashboardDataQuery : IRequest<BaseResponse<DashboardDto>>
{
}
