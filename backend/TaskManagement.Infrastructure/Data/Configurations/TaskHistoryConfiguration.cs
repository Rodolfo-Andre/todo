using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Infrastructure.Data.Configurations;

public class TaskHistoryConfiguration : IEntityTypeConfiguration<TaskHistory>
{
    public void Configure(EntityTypeBuilder<TaskHistory> builder)
    {
        builder.ToTable("TaskHistories");

        builder.HasKey(th => th.Id);

        builder.Property(th => th.Action)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(th => th.OldValue)
            .HasMaxLength(1000);

        builder.Property(th => th.NewValue)
            .HasMaxLength(1000);

        builder.HasIndex(th => th.TaskId);

        builder.HasIndex(th => th.CreatedAt)
            .IsDescending();

        builder.HasOne(th => th.Task)
            .WithMany(t => t.Histories)
            .HasForeignKey(th => th.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(th => th.User)
            .WithMany(u => u.TaskHistories)
            .HasForeignKey(th => th.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
