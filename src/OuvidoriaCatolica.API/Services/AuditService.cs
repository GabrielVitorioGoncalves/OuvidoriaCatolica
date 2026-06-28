using OuvidoriaCatolica.Models;

namespace OuvidoriaCatolica.API.Services;

public class AuditService
{
    private readonly AppDbContext _context;
    private readonly UserContext _userContext;

    public AuditService(AppDbContext context, UserContext userContext)
    {
        _context = context;
        _userContext = userContext;
    }

    public void Log(AuditActions action, string comments, Guid? explicitUserId = null)
    {
        var userId = explicitUserId ?? _userContext.GetCurrentUserId();
        var ip = _userContext.GetClientIpAddress();
        
        var log = new AuditLog(userId, action, ip, comments);
        
        _context.AuditLogs.Add(log);
        _context.SaveChanges(); 
    }

}