public class AuditLog
{
    public AuditLog(Guid userId, AuditActions actionExecuted, string ipAddress, string comments)
    {
        LogID = Guid.NewGuid();
        UserID = userId;
        ActionExecuted = actionExecuted;
        Timestamp = DateTime.Now;
        IPAddress = ipAddress;
        Comments = comments;
    }

    public Guid LogID { get; private set; }
    public Guid UserID { get; private set; }
    public AuditActions ActionExecuted { get; private set; }
    public DateTime Timestamp { get; private set; }
    public string IPAddress { get; private set; }
    public string Comments { get; private set; }
}

public enum AuditActions
{
    UserCreated = 1,
    UserUpdated = 2,
    UserDeactivated = 3,
    UserLoggedIn = 4,
    TicketCreated = 5,
    TicketUpdated = 6,
    TicketStatusChanged = 7,
    ResponseAdded = 8,
    CategoryCreated = 9,
    CategoryUpdated = 10,
    CategoryStatusChanged = 11,
    PermissionsChanged = 12
}