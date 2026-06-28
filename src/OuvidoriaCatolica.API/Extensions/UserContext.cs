using OuvidoriaCatolica.API.Extensions;

public class UserContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public Guid GetCurrentUserId()
    {
        var user = _httpContextAccessor.HttpContext?.User;
        
        if (user == null)
        {
            throw new UnauthorizedAccessException("Contexto de usuário não encontrado.");
        }

        return user.GetUserId();
    }

    public string GetClientIpAddress()
    {
        return _httpContextAccessor.HttpContext?.Connection?.RemoteIpAddress?.ToString() ?? "Desconhecido";
    }
}