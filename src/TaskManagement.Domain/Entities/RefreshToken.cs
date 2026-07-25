namespace TaskManagement.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime Expires { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? Revoked { get; set; }

    public User User { get; set; } = null!;
}
