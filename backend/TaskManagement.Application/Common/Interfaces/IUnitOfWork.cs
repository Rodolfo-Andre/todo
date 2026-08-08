using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Common.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<User> Users { get; }
    IRepository<Project> Projects { get; }
    IRepository<ProjectMember> ProjectMembers { get; }
    IRepository<TaskItem> Tasks { get; }
    IRepository<TaskComment> TaskComments { get; }
    IRepository<TaskAttachment> TaskAttachments { get; }
    IRepository<TaskHistory> TaskHistories { get; }
    IRepository<Notification> Notifications { get; }
    IRepository<AuditLog> AuditLogs { get; }
    IRepository<RefreshToken> RefreshTokens { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken);
}
