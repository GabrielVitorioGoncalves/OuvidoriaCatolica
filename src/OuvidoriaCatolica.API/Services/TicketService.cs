using Microsoft.EntityFrameworkCore;
using static TicketDtos;

public class TicketService
{
    private readonly AppDbContext _context;

    public TicketService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Ticket>> GetAllTicketsAsync()
    {
        return await _context.Tickets.AsNoTracking().ToListAsync();
    }

    public async Task<Ticket> CreateTicketAsync(CreateTicketRequest request)
    {
        var ticket = new Ticket(
            title: request.Title,
            description: request.Description,
            authorId: request.AuthorId,
            categoryId: request.CategoryId
        );

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        return ticket;
    }

    public async Task<TicketResponse> AddResponseAsync(Guid ticketId, CreateTicketResponseRequest request)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
            throw new KeyNotFoundException("Ticket não encontrado.");

        var response = new TicketResponse(ticketId, request.ResponsibleAttendantId, request.Message);

        var previousStatus = ticket.Status;

        if (ticket.Status == TicketStatus.New)
        {
            ticket.StartTicketReview();
            
            var history = new TicketHistory(ticketId, request.ResponsibleAttendantId, previousStatus, ticket.Status);
            _context.TicketHistories.Add(history);
            
            _context.Tickets.Update(ticket);
        }

        _context.TicketResponses.Add(response);
        await _context.SaveChangesAsync();

        return response;
    }

    public async Task RequestMoreInformationAsync(Guid ticketId, ChangeTicketStatusRequest request)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
            throw new KeyNotFoundException("Ticket não encontrado.");

        var previousStatus = ticket.Status;
        
        ticket.RequestMoreTicketInformation(); 

        var history = new TicketHistory(ticketId, request.ResponsibleAttendantId, previousStatus, ticket.Status);
        
        _context.TicketHistories.Add(history);
        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync();
    }

    public async Task CloseTicketAsync(Guid ticketId, ChangeTicketStatusRequest request)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
            throw new KeyNotFoundException("Ticket não encontrado.");

        var previousStatus = ticket.Status;
        ticket.CloseTicket();

        var history = new TicketHistory(ticketId, request.ResponsibleAttendantId, previousStatus, ticket.Status);
        
        _context.TicketHistories.Add(history);
        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<TicketHistory>> GetTicketHistoryAsync(Guid ticketId)
    {
        return await _context.TicketHistories
            .Where(h => h.TicketID == ticketId)
            .OrderByDescending(h => h.ChangedAt)
            .AsNoTracking()
            .ToListAsync();
    }
}