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
}