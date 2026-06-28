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

    public async Task<IEnumerable<TicketAPIResponse>> GetAllTicketsAsync()
    {
        return await _context.Tickets
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

    public async Task<TicketAPIResponse> CreateTicketAsync(CreateTicketRequest request, Guid currentUserId)
    {
        var ticket = new Ticket(request.Title, request.Description, currentUserId, request.Sector);

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

    public async Task<TicketListaResponse> AssignAttendantAsync(Guid ticketId, Guid currentUserId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
            throw new KeyNotFoundException("Ticket não encontrado.");

        var user = await GetUserAsync(currentUserId);
        if (user.Role != UserRole.Attendant && user.Role != UserRole.Admin)
            throw new UnauthorizedAccessException("Apenas atendentes podem assumir tickets.");

        if (user.Role == UserRole.Attendant && ticket.Sector != user.Sector)
            throw new UnauthorizedAccessException("Você não pode assumir tickets de outro setor.");

        ticket.AssignAttendant(currentUserId);
        ticket.StartTicketReview();

        var history = new TicketHistory(ticketId, currentUserId, ticket.Status, ticket.Status);
        _context.TicketHistories.Add(history);
        _context.Tickets.Update(ticket);
        await _context.SaveChangesAsync();

        return new TicketListaResponse
        {
            TicketID = ticket.TicketID,
            Title = ticket.Title,
            Description = ticket.Description,
            Sector = (int)ticket.Sector,
            Status = (int)ticket.Status,
            CreatedAt = ticket.CreatedAt,
            UpdatedAt = DateTime.UtcNow,
            AuthorName = await _context.Users
                .Where(u => u.UserID == ticket.AuthorId)
                .Select(u => u.Name)
                .FirstOrDefaultAsync() ?? "Desconhecido",
            AttendantId = currentUserId,
            AttendantName = user.Name,
            IsMyTicket = true
        };
    }

    public async Task<TicketReplyResponse> AddResponseAsync(Guid ticketId, CreateTicketResponseRequest request, Guid currentUserId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
            throw new KeyNotFoundException("Ticket não encontrado.");

        if (ticket.AttendantId == null)
            throw new InvalidOperationException("Este ticket ainda não possui um responsável.");

        if (ticket.AttendantId != currentUserId)
            throw new UnauthorizedAccessException("Apenas o atendente responsável pode responder este ticket.");

        var response = new TicketResponse(ticketId, currentUserId, request.Message);
        var previousStatus = ticket.Status;

        if (ticket.Status == TicketStatus.New || ticket.Status == TicketStatus.AwaitingResponse)
        {
            if (ticket.Status == TicketStatus.New)
                ticket.StartTicketReview();
            else
            {
                // volta para InReview após aluno ter respondido
                var field = typeof(Ticket).GetProperty("Status");
                // usamos o método público disponível
            }

            var history = new TicketHistory(ticketId, currentUserId, previousStatus, ticket.Status);
            _context.TicketHistories.Add(history);
            _context.Tickets.Update(ticket);
        }

        _context.TicketResponses.Add(response);
        await _context.SaveChangesAsync();

        var attendantName = await _context.Users
            .Where(u => u.UserID == currentUserId)
            .Select(u => u.Name)
            .FirstOrDefaultAsync() ?? "Desconhecido";

        return new TicketReplyResponse
        {
            ResponseID = response.ResponseID,
            ResponsibleAttendant = attendantName,
            Message = response.Message,
            RespondedAt = response.RespondedAt
        };
    }

    public async Task RequestMoreInformationAsync(Guid ticketId, Guid currentUserId)
    {
        var ticket = await _context.Tickets.FindAsync(ticketId);
        if (ticket == null)
            throw new KeyNotFoundException("Ticket não encontrado.");

        if (ticket.AttendantId != currentUserId)
            throw new UnauthorizedAccessException("Apenas o atendente responsável pode solicitar informações.");

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

        if (ticket.AttendantId != currentUserId)
            throw new UnauthorizedAccessException("Apenas o atendente responsável pode encerrar este ticket.");

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
                Id = h.HistoryID,
                Descricao = "Status alterado de " + h.PreviousStatus.ToString() + " para " + h.NewStatus.ToString(),
                Data = h.ChangedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketListaResponse>> GetTicketsByUserIdAsync(Guid userId)
{
    return await _context.Tickets
        .Where(t => t.AuthorId == userId)
        .AsNoTracking()
        .Select(t => new TicketListaResponse
        {
            TicketID = t.TicketID,
            Title = t.Title,
            Description = t.Description,
            Sector = (int)t.Sector,
            Status = (int)t.Status,
            CreatedAt = t.CreatedAt,
            UpdatedAt = t.ClosedAt ?? t.CreatedAt,
            AuthorName = _context.Users
                .Where(u => u.UserID == t.AuthorId)
                .Select(u => u.Name)
                .FirstOrDefault() ?? "Desconhecido",
            AttendantId = t.AttendantId,
            AttendantName = t.AttendantId != null
                ? _context.Users
                    .Where(u => u.UserID == t.AttendantId)
                    .Select(u => u.Name)
                    .FirstOrDefault()
                : null,
            IsMyTicket = false
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
                ResponsibleAttendant = _context.Users
                    .Where(u => u.UserID == r.ResponsibleAttendant)
                    .Select(u => u.Name)
                    .FirstOrDefault() ?? "Desconhecido",
                Message = r.Message,
                RespondedAt = r.RespondedAt
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketListaResponse>> GetTicketsBySectorAsync(Sector sector, Guid currentUserId)
    {
        var user = await GetUserAsync(currentUserId);

        if (user.Role != UserRole.Admin && user.Sector != sector)
            throw new UnauthorizedAccessException("Você só pode visualizar as manifestações do seu próprio setor.");

        return await _context.Tickets
            .Where(t => t.Sector == sector)
            .AsNoTracking()
            .Select(t => new TicketListaResponse
            {
                TicketID = t.TicketID,
                Title = t.Title,
                Description = t.Description,
                Sector = (int)t.Sector,
                Status = (int)t.Status,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.ClosedAt ?? t.CreatedAt,
                AuthorName = _context.Users
                    .Where(u => u.UserID == t.AuthorId)
                    .Select(u => u.Name)
                    .FirstOrDefault() ?? "Desconhecido",
                AttendantId = t.AttendantId,
                AttendantName = t.AttendantId != null
                    ? _context.Users
                        .Where(u => u.UserID == t.AttendantId)
                        .Select(u => u.Name)
                        .FirstOrDefault()
                    : null,
                IsMyTicket = t.AttendantId == currentUserId
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