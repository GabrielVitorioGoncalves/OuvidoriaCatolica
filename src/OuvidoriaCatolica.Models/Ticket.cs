public class Ticket
{
    public Ticket(string title, string description, Guid authorId, Guid categoryId)
    {
        ValidateInput(title, description);
        TicketID = Guid.NewGuid();
        Protocol = protocol;
        Title = title;
        Description = description;
        AuthorId = authorId;
        CategoryId = categoryId;
        Status = TicketStatus.New;
        CreatedAt = DateTime.Now;
    }

    public Guid TicketID { get; private set; }
    public string Protocol { get; private set; }
    public string Title { get; private set; }
    public string Description { get; private set; }
    public Guid AuthorId { get; private set; }
    public Guid CategoryId { get; private set; }
    public TicketStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime ClosedAt { get; private set; }

    public void UpdateTicket(string title, string description)
    {
        ValidateInput(title, description);
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
            throw new InvalidOperationException("Only tickets in review can be marked as awaiting response");
        }
        Status = TicketStatus.AwaitingResponse;
    }

    public void CloseTicket()
    {
        Status = TicketStatus.Closed;
        ClosedAt = DateTime.Now;
    }

    private static void ValidateInput(string title, string description)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            throw new ArgumentException("Title is required");
        }
        if (string.IsNullOrWhiteSpace(description))
        {
            throw new ArgumentException("Description is required");
        }
    }
}

public enum TicketStatus
{
    New = 1,
    InReview = 2,
    AwaitingResponse = 3,
    Closed = 4
}