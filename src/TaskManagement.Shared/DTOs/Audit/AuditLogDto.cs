namespace TaskManagement.Shared.DTOs.Audit;

public class AuditLogDto
{
    public Guid Id { get; set; }
    public Guid? UserId { get; set; }
    public string? UserName { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public string? OldValues { get; set; }
    public string? NewValues { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AuditLogFilterDto
{
    public string? Action { get; set; }
    public string? EntityName { get; set; }
    public Guid? UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class AuditLogSummaryDto
{
    public int TotalLogs { get; set; }
    public int TodayLogs { get; set; }
    public Dictionary<string, int> LogsByAction { get; set; } = new();
    public Dictionary<string, int> LogsByEntity { get; set; } = new();
    public List<AuditLogDto> RecentLogs { get; set; } = new();
}
