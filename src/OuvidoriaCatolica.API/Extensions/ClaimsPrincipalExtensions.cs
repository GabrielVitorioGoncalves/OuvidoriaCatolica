using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace OuvidoriaCatolica.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var userIdString = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                        ?? principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrEmpty(userIdString) || !Guid.TryParse(userIdString, out var userId))
        {
            throw new UnauthorizedAccessException("Não foi possível identificar o usuário autenticado no token.");
        }

        return userId;
    }
}