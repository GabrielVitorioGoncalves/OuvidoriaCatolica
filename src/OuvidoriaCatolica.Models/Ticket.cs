public class Ticket
{
    public Ticket(string protocol, string title, string description)
    {
        if (string.IsNullOrWhiteSpace(protocol))
        {
            throw new InvalidOperationException("Protocol cannot be null or empty");
        }
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new InvalidOperationException("Title cannot be null or empty");
        }
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new InvalidOperationException("Description cannot be null or empty");
        }
        TicketID = Guid.NewGuid();
        Protocol = protocol;
        Title = title;
        Description = description;
        Status = TicketStatus.New;
        CreatedAt = DateTime.Now;
    }

    public Guid TicketID { get; private set; }
    public string Protocol { get; private set; }
    public string Title { get; private set; }
    public string Description { get; private set; }
    public TicketStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime ClosedAt { get; private set; }

    public void UpdateTicket(string title, string description)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new InvalidOperationException("Title cannot be null or empty");
        }
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new InvalidOperationException("Description cannot be null or empty");
        }
        Title = title;
        Description = description;
    }

    public void StartTicketReview()
    {
        if (Status != TicketStatus.New)
        {
            throw new InvalidOperationException("Only new tickets can be reviewed");
        }
        Status = TicketStatus.InReview;
    }

    public void RequestMoreTicketInformation()
    {
        if (Status != TicketStatus.InReview)
        {
            // throw new InvalidOperationException("Only tickets in review can ");
            throw new InvalidOperationException();
        }
        Status = TicketStatus.AwaitingResponse;
    }

    public void CloseTicket()
    {
        Status = TicketStatus.Closed;
        ClosedAt = DateTime.Now;
    }
}

public enum TicketStatus
{
    New = 1,
    InReview = 2,
    AwaitingResponse = 3,
    Closed = 4
}