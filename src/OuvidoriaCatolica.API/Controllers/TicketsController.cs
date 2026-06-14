using Microsoft.AspNetCore.Mvc;
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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTicketRequest request)
    {
        try
        {
            var createdTicket = await _service.CreateTicketAsync(request);
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

    [HttpPost("{id}/responses")]
    public async Task<IActionResult> AddResponse(Guid id, [FromBody] CreateTicketResponseRequest request)
    {
        try
        {
            var response = await _service.AddResponseAsync(id, request);
            
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
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao adicionar a resposta." });
        }
    }

    [HttpPut("{id}/request-info")]
    public async Task<IActionResult> RequestMoreInfo(Guid id, [FromBody] ChangeTicketStatusRequest request)
    {
        try
        {
            await _service.RequestMoreInformationAsync(id, request);
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
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao alterar o status do ticket." });
        }
    }

    [HttpPut("{id}/close")]
    public async Task<IActionResult> CloseTicket(Guid id, [FromBody] ChangeTicketStatusRequest request)
    {
        try
        {
            await _service.CloseTicketAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao fechar o ticket." });
        }
    }

    [HttpGet("{id}/history")]
    public async Task<IActionResult> GetHistory(Guid id)
    {
        try
        {
            var history = await _service.GetTicketHistoryAsync(id);
            return Ok(history);
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar o histórico do ticket." });
        }
    }
}