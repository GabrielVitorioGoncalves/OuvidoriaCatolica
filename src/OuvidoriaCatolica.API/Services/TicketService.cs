using Microsoft.EntityFrameworkCore;
using OuvidoriaCatolica.Models;
using static TicketDtos;

namespace OuvidoriaCatolica.API.Services;

public class TicketService
{
    private readonly AppDbContext _context;

    public TicketService(AppDbContext context)
    {
        _context = context;
    }

    // CORREÇÃO: Método agora recebe o currentUserId para bater com o Controller
    public async Task<IEnumerable<TicketAPIResponse>> GetAllTicketsAsync(Guid currentUserId)
    {
        return await _context.Tickets
            .Include(t => t.Author)
            .Include(t => t.Attendant)
            .AsNoTracking()
    .Select(t => new TicketAPIResponse
    {
        TicketID = t.TicketID,
        Title = t.Title,
        Description = t.Description,
        AuthorId = t.AuthorId,
        // Trocado de .Nome para .Name
        AuthorName = t.Author != null ? t.Author.Name : "Desconhecido",
        // Trocado de .Nome para .Name
        AttendantName = t.Attendant != null ? t.Attendant.Name : "Sem atendente",
        Sector = t.Sector.ToString(),
        Status = t.Status.ToString(),
        CreatedAt = t.CreatedAt,
        UpdatedAt = t.CreatedAt,
        ClosedAt = t.ClosedAt,
        IsMyTicket = (t.AttendantId == currentUserId)
    })
            .ToListAsync();
    }

    public async Task<TicketAPIResponse> CreateTicketAsync(CreateTicketRequest request, Guid currentUserId)
    {
        var ticket = new Ticket(
            request.Title,
            request.Description,
            currentUserId,
            // categoryId: request.CategoryId,
            request.Sector
        );

        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();

        return new TicketAPIResponse
        {
            TicketID = ticket.TicketID,
            Title = ticket.Title,
            Description = ticket.Description,
            AuthorId = ticket.AuthorId,
            Sector = ticket.Sector.ToString(),
            Status = ticket.Status.ToString(),
            CreatedAt = ticket.CreatedAt,
            ClosedAt = ticket.ClosedAt
        };
    }

    public async Task<TicketReplyResponse> AddResponseAsync(Guid ticketId, CreateTicketResponseRequest request, Guid currentUserId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
            throw new KeyNotFoundException("Ticket não encontrado.");

        await ValidateUserAccessToTicketAsync(ticket, currentUserId);

        var response = new TicketResponse(ticketId, currentUserId, request.Message);

        var previousStatus = ticket.Status;

        if (ticket.Status == TicketStatus.New)
        {
            ticket.StartTicketReview();

            var history = new TicketHistory(ticketId, currentUserId, previousStatus, ticket.Status);
            _context.TicketHistories.Add(history);

            _context.Tickets.Update(ticket);
        }

        _context.TicketResponses.Add(response);
        await _context.SaveChangesAsync();

        return new TicketReplyResponse
        {
            ResponseID = response.ResponseID,
            ResponsibleAttendant = response.ResponsibleAttendant,
            Message = response.Message,
            RespondedAt = response.RespondedAt
        };
    }

    public async Task RequestMoreInformationAsync(Guid ticketId, Guid currentUserId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
            throw new KeyNotFoundException("Ticket não encontrado.");

        await ValidateUserAccessToTicketAsync(ticket, currentUserId);

        var previousStatus = ticket.Status;

        ticket.RequestMoreTicketInformation();

        var history = new TicketHistory(ticketId, currentUserId, previousStatus, ticket.Status);

        _context.TicketHistories.Add(history);
        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync();
    }

    public async Task CloseTicketAsync(Guid ticketId, Guid currentUserId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
            throw new KeyNotFoundException("Ticket não encontrado.");

        await ValidateUserAccessToTicketAsync(ticket, currentUserId);

        var previousStatus = ticket.Status;
        ticket.CloseTicket();

        var history = new TicketHistory(ticketId, currentUserId, previousStatus, ticket.Status);

        _context.TicketHistories.Add(history);
        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<TicketHistoryResponse>> GetTicketHistoryAsync(Guid ticketId, Guid currentUserId)
    {
        var ticket = await _context.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.TicketID == ticketId);

        if (ticket == null)
            throw new KeyNotFoundException("Ticket não encontrado.");

        await ValidateUserAccessToTicketAsync(ticket, currentUserId);

        return await _context.TicketHistories
            .Where(h => h.TicketID == ticketId)
            .OrderByDescending(h => h.ChangedAt)
            .AsNoTracking()
            .Select(h => new TicketHistoryResponse
            {
                HistoryID = h.HistoryID,
                ResponsibleAttendant = h.ResponsibleAttendant,
                PreviousStatus = h.PreviousStatus.ToString(),
                NewStatus = h.NewStatus.ToString(),
                ChangedAt = h.ChangedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketAPIResponse>> GetTicketsByUserIdAsync(Guid userId)
    {
        return await _context.Tickets
            .Where(t => t.AuthorId == userId)
            .AsNoTracking()
            .Select(t => new TicketAPIResponse
            {
                TicketID = t.TicketID,
                Title = t.Title,
                Description = t.Description,
                AuthorId = t.AuthorId,
                Sector = t.Sector.ToString(),
                Status = t.Status.ToString(),
                CreatedAt = t.CreatedAt,
                ClosedAt = t.ClosedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketReplyResponse>> GetTicketResponsesAsync(Guid ticketId, Guid currentUserId)
    {
        var ticket = await _context.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.TicketID == ticketId);

        if (ticket == null) throw new KeyNotFoundException("Ticket não encontrado.");

        await ValidateUserAccessToTicketAsync(ticket, currentUserId);

        return await _context.TicketResponses
            .Where(r => r.TicketID == ticketId)
            .OrderBy(r => r.RespondedAt)
            .AsNoTracking()
            .Select(r => new TicketReplyResponse
            {
                ResponseID = r.ResponseID,
                ResponsibleAttendant = r.ResponsibleAttendant,
                Message = r.Message,
                RespondedAt = r.RespondedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketAPIResponse>> GetTicketsBySectorAsync(Sector sector, Guid currentUserId)
    {
        var user = await GetUserAsync(currentUserId);

        if (user.Role != UserRole.Admin && user.Sector != sector)
            throw new UnauthorizedAccessException("Você só pode visualizar as manifestações do seu próprio setor.");

        return await _context.Tickets
            .Where(t => t.Sector == sector)
            .AsNoTracking()
            .Select(t => new TicketAPIResponse
            {
                TicketID = t.TicketID,
                Title = t.Title,
                Description = t.Description,
                AuthorId = t.AuthorId,
                Sector = t.Sector.ToString(),
                Status = t.Status.ToString(),
                CreatedAt = t.CreatedAt,
                ClosedAt = t.ClosedAt
            })
            .ToListAsync();
    }

    private async Task ValidateUserAccessToTicketAsync(Ticket ticket, Guid currentUserId)
    {
        var user = await GetUserAsync(currentUserId);

        if (user.Role == UserRole.Admin)
            return;

        if (user.Role == UserRole.Attendant && ticket.Sector != user.Sector)
            throw new UnauthorizedAccessException("Você não tem permissão para acessar manifestações deste setor.");

        if (user.Role == UserRole.Common && ticket.AuthorId != currentUserId)
            throw new UnauthorizedAccessException("Você não tem permissão para acessar esta manifestação.");
    }

    private async Task<User> GetUserAsync(Guid userId)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.UserID == userId);

        if (user == null)
            throw new KeyNotFoundException("Usuário não encontrado.");

        return user;
    }
}