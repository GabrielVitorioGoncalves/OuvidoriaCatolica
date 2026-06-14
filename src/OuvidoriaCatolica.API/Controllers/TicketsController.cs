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
}