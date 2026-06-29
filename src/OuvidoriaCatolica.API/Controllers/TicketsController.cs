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

    public TicketsController(TicketService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin")]
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

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var currentUserId = User.GetUserId();
            var ticket = await _service.GetTicketByIdAsync(id, currentUserId);
            return Ok(ticket);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar o ticket." });
        }
    }

    [Authorize(Roles = "Common")]
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

    [Authorize(Roles = "Attendant, Admin")]
    [HttpPut("{id}/assign")]
    public async Task<IActionResult> AssignAttendant(Guid id)
    {
        try
        {
            var currentUserId = User.GetUserId();
            var ticket = await _service.AssignAttendantAsync(id, currentUserId);
            return Ok(ticket);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao assumir o ticket." });
        }
    }

    [Authorize(Roles = "Attendant, Admin")]
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
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao adicionar a resposta." });
        }
    }

    [Authorize(Roles = "Attendant, Admin")]
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
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao alterar o status do ticket." });
        }
    }

    [Authorize(Roles = "Attendant, Admin")]
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
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao fechar o ticket." });
        }
    }

    [Authorize(Roles = "Attendant, Admin")]
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

    [Authorize(Roles = "Common")]
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
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar as respostas do ticket." });
        }
    }

    [Authorize(Roles = "Attendant")]
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
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar as manifestações por setor." });
        }
    }
}