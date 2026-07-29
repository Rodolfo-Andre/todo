namespace TaskManagement.Shared.DTOs.Dashboard;

public class DashboardDto
{
    public DashboardStatsDto Stats { get; set; } = new();
    public List<TaskByStatusDto> TasksByStatus { get; set; } = new();
    public List<TaskByPriorityDto> TasksByPriority { get; set; } = new();
    public List<TaskByMemberDto> TasksByMember { get; set; } = new();
    public List<RecentActivityDto> RecentActivity { get; set; } = new();
    public List<UpcomingDeadlineDto> UpcomingDeadlines { get; set; } = new();
}

public class DashboardStatsDto
{
    public int TotalProjects { get; set; }
    public int TotalTasks { get; set; }
    public int MyAssignedTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int InProgressTasks { get; set; }
    public int OverdueTasks { get; set; }
    public int TotalMembers { get; set; }
}

public class TaskByStatusDto
{
    public string Status { get; set; } = string.Empty;
    public int Count { get; set; }
    public int Percentage { get; set; }
}

public class TaskByPriorityDto
{
    public string Priority { get; set; } = string.Empty;
    public int Count { get; set; }
    public int Percentage { get; set; }
}

public class TaskByMemberDto
{
    public string MemberName { get; set; } = string.Empty;
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int PendingTasks { get; set; }
}

public class RecentActivityDto
{
    public string UserName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string TaskTitle { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class UpcomingDeadlineDto
{
    public string TaskTitle { get; set; } = string.Empty;
    public string ProjectName { get; set; } = string.Empty;
    public string AssignedToName { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public int DaysRemaining { get; set; }
    public int Priority { get; set; }
}
