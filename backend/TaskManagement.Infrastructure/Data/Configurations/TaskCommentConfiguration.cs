using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Infrastructure.Data.Configurations;

public class TaskCommentConfiguration : IEntityTypeConfiguration<TaskComment>
{
    public void Configure(EntityTypeBuilder<TaskComment> builder)
    {
        builder.ToTable("TaskComments");

        builder.HasKey(tc => tc.Id);

        builder.Property(tc => tc.Content)
            .IsRequired()
            .HasMaxLength(2000);

        builder.HasIndex(tc => tc.TaskId);

        builder.HasOne(tc => tc.Task)
            .WithMany(t => t.Comments)
            .HasForeignKey(tc => tc.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(tc => tc.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(tc => tc.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
