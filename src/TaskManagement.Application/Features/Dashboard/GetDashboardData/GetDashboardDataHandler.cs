using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.DTOs.Dashboard;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Dashboard.GetDashboardData;

public class GetDashboardDataHandler : IRequestHandler<GetDashboardDataQuery, BaseResponse<DashboardDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public GetDashboardDataHandler(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<DashboardDto>> Handle(
        GetDashboardDataQuery request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return new BaseResponse<DashboardDto>
            {
                Success = false,
                Message = "User not authenticated"
            };
        }

        var currentUserId = Guid.Parse(userId);

        // Get all data
        var projects = await _unitOfWork.Projects.GetAllAsync(cancellationToken);
        var tasks = await _unitOfWork.Tasks.GetAllAsync(cancellationToken);
        var members = await _unitOfWork.ProjectMembers.GetAllAsync(cancellationToken);
        var histories = await _unitOfWork.TaskHistories.GetAllAsync(cancellationToken);
        var users = await _unitOfWork.Users.GetAllAsync(cancellationToken);

        var activeTasks = tasks.Where(t => t.DeletedAt == null).ToList();
        var myTasks = activeTasks.Where(t => t.AssignedToId == currentUserId).ToList();

        // Stats
        var stats = new DashboardStatsDto
        {
            TotalProjects = projects.Count(p => p.DeletedAt == null),
            TotalTasks = activeTasks.Count,
            MyAssignedTasks = myTasks.Count,
            CompletedTasks = activeTasks.Count(t => t.Status == 3), // Done
            InProgressTasks = activeTasks.Count(t => t.Status == 1), // In Progress
            OverdueTasks = activeTasks.Count(t => t.DueDate.HasValue && t.DueDate.Value < DateTime.UtcNow && t.Status != 3),
            TotalMembers = members.Count
        };

        // Tasks by status
        var statusMap = new Dictionary<int, string>
        {
            { 0, "Todo" },
            { 1, "In Progress" },
            { 2, "In Review" },
            { 3, "Done" },
            { 4, "Cancelled" }
        };

        var tasksByStatus = statusMap.Select(s => new TaskByStatusDto
        {
            Status = s.Value,
            Count = activeTasks.Count(t => t.Status == s.Key),
            Percentage = activeTasks.Count > 0
                ? (int)Math.Round((double)activeTasks.Count(t => t.Status == s.Key) / activeTasks.Count * 100)
                : 0
        }).ToList();

        // Tasks by priority
        var priorityMap = new Dictionary<int, string>
        {
            { 0, "Low" },
            { 1, "Medium" },
            { 2, "High" },
            { 3, "Critical" }
        };

        var tasksByPriority = priorityMap.Select(p => new TaskByPriorityDto
        {
            Priority = p.Value,
            Count = activeTasks.Count(t => t.Priority == p.Key),
            Percentage = activeTasks.Count > 0
                ? (int)Math.Round((double)activeTasks.Count(t => t.Priority == p.Key) / activeTasks.Count * 100)
                : 0
        }).ToList();

        // Tasks by member (top 10)
        var tasksByMember = activeTasks
            .Where(t => t.AssignedToId.HasValue)
            .GroupBy(t => t.AssignedToId!.Value)
            .Select(g => new TaskByMemberDto
            {
                MemberName = users.FirstOrDefault(u => u.Id == g.Key)?.FullName ?? "Unknown",
                TotalTasks = g.Count(),
                CompletedTasks = g.Count(t => t.Status == 3),
                PendingTasks = g.Count(t => t.Status != 3)
            })
            .OrderByDescending(m => m.TotalTasks)
            .Take(10)
            .ToList();

        // Recent activity (last 10)
        var recentActivity = histories
            .OrderByDescending(h => h.CreatedAt)
            .Take(10)
            .Select(h =>
            {
                var task = activeTasks.FirstOrDefault(t => t.Id == h.TaskId);
                var user = users.FirstOrDefault(u => u.Id == h.UserId);
                var project = task != null ? projects.FirstOrDefault(p => p.Id == task.ProjectId) : null;
                return new RecentActivityDto
                {
                    UserName = user?.FullName ?? "Unknown",
                    Action = h.Action,
                    TaskTitle = task?.Title ?? "Unknown Task",
                    ProjectName = project?.Name ?? "Unknown Project",
                    CreatedAt = h.CreatedAt
                };
            })
            .ToList();

        // Upcoming deadlines (next 7 days)
        var upcomingDeadlines = activeTasks
            .Where(t => t.DueDate.HasValue && t.DueDate.Value >= DateTime.UtcNow && t.Status != 3)
            .OrderBy(t => t.DueDate)
            .Take(5)
            .Select(t =>
            {
                var assignedUser = t.AssignedToId.HasValue
                    ? users.FirstOrDefault(u => u.Id == t.AssignedToId.Value)
                    : null;
                var project = projects.FirstOrDefault(p => p.Id == t.ProjectId);
                return new UpcomingDeadlineDto
                {
                    TaskTitle = t.Title,
                    ProjectName = project?.Name ?? "Unknown",
                    AssignedToName = assignedUser?.FullName ?? "Unassigned",
                    DueDate = t.DueDate!.Value,
                    DaysRemaining = (t.DueDate.Value - DateTime.UtcNow).Days,
                    Priority = t.Priority
                };
            })
            .ToList();

        var dashboard = new DashboardDto
        {
            Stats = stats,
            TasksByStatus = tasksByStatus,
            TasksByPriority = tasksByPriority,
            TasksByMember = tasksByMember,
            RecentActivity = recentActivity,
            UpcomingDeadlines = upcomingDeadlines
        };

        return new BaseResponse<DashboardDto>
        {
            Success = true,
            Message = "Dashboard data retrieved successfully",
            Data = dashboard
        };
    }
}
