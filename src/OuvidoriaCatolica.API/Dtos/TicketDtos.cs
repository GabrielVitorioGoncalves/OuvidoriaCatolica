public class TicketDtos
{
    public class CreateTicketRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public Guid AuthorId { get; set; }
        public Guid CategoryId { get; set; }
    }

    public class CreateTicketResponseRequest
    {
        public Guid ResponsibleAttendantId { get; set; }
        public string Message { get; set; }
    }

    public class ChangeTicketStatusRequest
    {
        public Guid ResponsibleAttendantId { get; set; }
    }
}