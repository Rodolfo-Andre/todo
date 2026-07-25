using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Repositories.Base;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Users = new Repository<User>(context);
        Projects = new Repository<Project>(context);
        ProjectMembers = new Repository<ProjectMember>(context);
        Tasks = new Repository<TaskItem>(context);
        TaskComments = new Repository<TaskComment>(context);
        TaskAttachments = new Repository<TaskAttachment>(context);
        TaskHistories = new Repository<TaskHistory>(context);
        Notifications = new Repository<Notification>(context);
        AuditLogs = new Repository<AuditLog>(context);
        RefreshTokens = new Repository<RefreshToken>(context);
    }

    public IRepository<User> Users { get; }
    public IRepository<Project> Projects { get; }
    public IRepository<ProjectMember> ProjectMembers { get; }
    public IRepository<TaskItem> Tasks { get; }
    public IRepository<TaskComment> TaskComments { get; }
    public IRepository<TaskAttachment> TaskAttachments { get; }
    public IRepository<TaskHistory> TaskHistories { get; }
    public IRepository<Notification> Notifications { get; }
    public IRepository<AuditLog> AuditLogs { get; }
    public IRepository<RefreshToken> RefreshTokens { get; }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
