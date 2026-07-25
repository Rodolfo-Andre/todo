using System.Security.Claims;
using TaskManagement.Domain.Entities;

namespace TaskManagement.Application.Common.Interfaces;

public interface IJwtTokenService
{
    string GenerateAccessToken(User user, IList<string> roles);
    string GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}
