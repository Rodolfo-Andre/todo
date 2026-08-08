using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Infrastructure.Data.Configurations;

public class TaskAttachmentConfiguration : IEntityTypeConfiguration<TaskAttachment>
{
    public void Configure(EntityTypeBuilder<TaskAttachment> builder)
    {
        builder.ToTable("TaskAttachments");

        builder.HasKey(ta => ta.Id);

        builder.Property(ta => ta.FileName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(ta => ta.FilePath)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(ta => ta.ContentType)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(ta => ta.TaskId);

        builder.HasOne(ta => ta.Task)
            .WithMany(t => t.Attachments)
            .HasForeignKey(ta => ta.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ta => ta.User)
            .WithMany(u => u.Attachments)
            .HasForeignKey(ta => ta.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
