namespace OuvidoriaCatolica.Models;

public class TicketHistory
{
    public TicketHistory(Guid ticketId, Guid responsibleAttendant, TicketStatus previousStatus, TicketStatus newStatus)
    {
        HistoryID = Guid.NewGuid();
        TicketID = ticketId;
        ResponsibleAttendant = responsibleAttendant;
        PreviousStatus = previousStatus;
        NewStatus = newStatus;
        ChangedAt = DateTime.UtcNow;
    }

    // EF Core
    private TicketHistory() {}

    public Guid HistoryID { get; private set; }
    public Guid TicketID { get; private set; }
    public Guid ResponsibleAttendant { get; private set; }
    public TicketStatus PreviousStatus { get; private set; }
    public TicketStatus NewStatus { get; private set; }
    public DateTime ChangedAt { get; private set; }
}