using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Common.Interfaces;

public interface IAuditService
{
    Task LogAsync(
        Guid? userId,
        string action,
        string entityName,
        string? entityId = null,
        object? oldValues = null,
        object? newValues = null,
        string? ipAddress = null,
        string? userAgent = null,
        CancellationToken cancellationToken = default);

    Task<List<AuditLog>> GetLogsByEntityAsync(
        string entityName,
        string entityId,
        CancellationToken cancellationToken = default);
}
