using OuvidoriaCatolica.Models;

public class TicketDtos
{
    public class CreateTicketRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Guid AuthorId { get; set; }
        // public Guid CategoryId { get; set; }
        public Sector Sector { get; set; }
    }

    // CRIAR UM TICKETRESPONSE -> GET API

    public class CreateTicketResponseRequest
    {
        public Guid ResponsibleAttendantId { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class ChangeTicketStatusRequest
    {
        public Guid ResponsibleAttendantId { get; set; }
    }
}