using OuvidoriaCatolica.Models;

public class TicketDtos
{
public class TicketAPIResponse
{
    public Guid TicketID { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public string AttendantName { get; set; } = string.Empty;
    public string Sector { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; } 
    public DateTime? ClosedAt { get; set; }
    public bool IsMyTicket { get; set; }
}

    public class CreateTicketRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        // public Guid CategoryId { get; set; }
        public Sector Sector { get; set; }
    }

    public class CreateTicketResponseRequest
    {
        public string Message { get; set; } = string.Empty;
    }

    public class TicketReplyResponse
    {
        public Guid ResponseID { get; set; }
        public Guid ResponsibleAttendant { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime RespondedAt { get; set; }
    }

    public class TicketHistoryResponse
    {
        public Guid HistoryID { get; set; }
        public Guid ResponsibleAttendant { get; set; }
        public string PreviousStatus { get; set; } = string.Empty;
        public string NewStatus { get; set; } = string.Empty;
        public DateTime ChangedAt { get; set; }
    }
}