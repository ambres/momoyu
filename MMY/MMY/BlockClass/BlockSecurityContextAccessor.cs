using System.Security.Claims;
using Jupiter.Infrastructure.Permission;
using Jupiter.Infrastructure.Permission.Models;

namespace MMY.BlockClass;

public class BlockSecurityContextAccessor : ISecurityContextAccessor
{
    public string CreateToken(JwtConfig config, List<Claim> claims, string scheme = "Bearer")
    {
        return "";
    }

    public string? UserId { get; } = "root";
    public string? RealName { get; } = "root";
    public string? UserName { get; } = "root";
    public bool IsRoot { get; } = true;
    public string? EnterpriseAppId { get; } = "root";
    public string? EnterpriseId { get; } = "root";
    public string? Role { get; } = "root";
    public string? RoleName { get; } = "root";
    public string? JwtToken { get; } = "root";
    public bool IsAuthenticated { get; } = true;
    public string? TraceIdentifier { get; } = "root";
    public string? OrganizationIds { get; } = "root";
}