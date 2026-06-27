using OuvidoriaCatolica.Models;

public class TicketDtos
{
    public class TicketAPIResponse
    {
        public Guid TicketID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid AuthorId { get; set; }
        public string Sector { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
    }

    public class TicketListaResponse
    {
        public Guid TicketID { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Sector { get; set; }
        public int Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string? AttendantName { get; set; }
        public bool IsMyTicket { get; set; }
    }

    public class CreateTicketRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Sector Sector { get; set; }
    }

    public class CreateTicketResponseRequest
    {
        public string Message { get; set; } = string.Empty;
    }

    public class TicketReplyResponse
    {
        public Guid ResponseID { get; set; }
        public string ResponsibleAttendant { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime RespondedAt { get; set; }
    }

    public class TicketHistoryResponse
    {
        public Guid Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public DateTime Data { get; set; }
    }
}