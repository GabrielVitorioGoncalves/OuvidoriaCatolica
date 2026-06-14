public class TicketResponse
{
    public TicketResponse(Guid ticketId, Guid responsibleAttendant, string message)
    {
        if (string.IsNullOrWhiteSpace(message))
        {
            throw new ArgumentException("Message is required");
        }

        ResponseID = Guid.NewGuid();
        TicketID = ticketId;
        ResponsibleAttendant = responsibleAttendant;
        Message = message;
        RespondedAt = DateTime.Now;
    }

    // EF Core
    private TicketResponse() {}

    public Guid ResponseID { get; private set; }
    public Guid TicketID { get; private set; }
    public Guid ResponsibleAttendant { get; set; }
    public string Message { get; private set; }
    public DateTime RespondedAt { get; private set; }
}