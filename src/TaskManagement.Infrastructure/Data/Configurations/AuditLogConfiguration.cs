using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Infrastructure.Data.Configurations;

public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
{
    public void Configure(EntityTypeBuilder<AuditLog> builder)
    {
        builder.ToTable("AuditLogs");

        builder.HasKey(al => al.Id);

        builder.Property(al => al.Action)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(al => al.EntityName)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(al => al.EntityId)
            .HasMaxLength(100);

        builder.Property(al => al.OldValues)
            .HasMaxLength(int.MaxValue); // MAX

        builder.Property(al => al.NewValues)
            .HasMaxLength(int.MaxValue); // MAX

        builder.Property(al => al.IpAddress)
            .HasMaxLength(50);

        builder.Property(al => al.UserAgent)
            .HasMaxLength(500);

        builder.HasIndex(al => al.UserId);

        builder.HasIndex(al => al.EntityName);

        builder.HasIndex(al => al.CreatedAt)
            .IsDescending();
    }
}
