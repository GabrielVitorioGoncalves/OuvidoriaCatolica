using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OuvidoriaCatolica.API.Extensions;
using OuvidoriaCatolica.API.Services;
using OuvidoriaCatolica.Models;
using static TicketDtos;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly TicketService _service;

    public TicketsController(AppDbContext context)
    {
        _service = new TicketService(context);
    }

    // ALTERAÇÃO FEITA AQUI: Agora os atendentes (Attendant e 2) podem listar tudo
    [Authorize(Roles = "Admin, Attendant, 3, 2")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var tickets = await _service.GetAllTicketsAsync();
            return Ok(tickets); 
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar os tickets." });
        }
    }

    [Authorize(Roles = "Common, 1")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTicketRequest request)
    {
        try
        {
            var currentUserId = User.GetUserId();
            var createdTicket = await _service.CreateTicketAsync(request, currentUserId);
            return StatusCode(201, createdTicket); 
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message }); 
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao criar o ticket." });
        }
    }

    [Authorize(Roles = "Attendant, Admin, 2, 3")]
    [HttpPost("{id}/responses")]
    public async Task<IActionResult> AddResponse(Guid id, [FromBody] CreateTicketResponseRequest request)
    {
        try
        {
            var currentUserId = User.GetUserId();
            var response = await _service.AddResponseAsync(id, request, currentUserId);
            return StatusCode(201, response);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao adicionar a resposta." });
        }
    }

    [Authorize(Roles = "Attendant, Admin, 2, 3")]
    [HttpPut("{id}/request-info")]
    public async Task<IActionResult> RequestMoreInfo(Guid id)
    {
        try
        {
            var currentUserId = User.GetUserId();
            await _service.RequestMoreInformationAsync(id, currentUserId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao alterar o status do ticket." });
        }
    }

    [Authorize(Roles = "Attendant, Admin, 2, 3")]
    [HttpPut("{id}/close")]
    public async Task<IActionResult> CloseTicket(Guid id)
    {
        try
        {
            var currentUserId = User.GetUserId();
            await _service.CloseTicketAsync(id, currentUserId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao fechar o ticket." });
        }
    }

    [Authorize(Roles = "Attendant, Admin, 2, 3")]
    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(Guid id)
    {
        try
        {
            var currentUserId = User.GetUserId();
            var history = await _service.GetTicketHistoryAsync(id, currentUserId);
            return Ok(history);
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar o histórico do ticket." });
        }
    }

    [Authorize(Roles = "Common, 1")]
    [HttpGet("my-tickets")] 
    public async Task<IActionResult> GetMyTickets()
    {
        try
        {
            var currentUserId = User.GetUserId();
            var tickets = await _service.GetTicketsByUserIdAsync(currentUserId);
            return Ok(tickets); 
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar os seus tickets." });
        }
    }

    [Authorize]
    [HttpGet("{id}/responses")]
    public async Task<IActionResult> GetResponses(Guid id)
    {
        try
        {
            var currentUserId = User.GetUserId();
            var responses = await _service.GetTicketResponsesAsync(id, currentUserId);
            return Ok(responses);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar as respostas do ticket." });
        }
    }

    [Authorize(Roles = "Attendant, 2")]
    [HttpGet("sector/{sector}")]
    public async Task<IActionResult> GetBySector(Sector sector)
    {
        try
        {
            var currentUserId = User.GetUserId();
            var tickets = await _service.GetTicketsBySectorAsync(sector, currentUserId);
            return Ok(tickets);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar as manifestações por setor." });
        }
    }
}