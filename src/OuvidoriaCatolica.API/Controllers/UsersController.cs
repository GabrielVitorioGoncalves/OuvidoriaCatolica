using Microsoft.AspNetCore.Mvc;
using OuvidoriaCatolica.API.Services.Interfaces;
using OuvidoriaCatolica.API.DTOs.User;
using Microsoft.AspNetCore.Authorization;
using OuvidoriaCatolica.API.Extensions;

namespace OuvidoriaCatolica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _service;

    public UsersController(IUserService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _service.GetAllAsync();
        return Ok(users);
    }

    [Authorize(Roles = "Admin")]    
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await _service.GetByIdAsync(id);

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateUserDto dto)
    {
        var currentUserId = User.GetUserId();
        var user = await _service.CreateAsync(dto, currentUserId);

        return CreatedAtAction(
            nameof(GetById),
            new { id = user.UserID },
            user);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateUserDto dto)
    {
        var currentUserId = User.GetUserId();
        await _service.UpdateAsync(id, dto, currentUserId);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> ChangeStatus(
        Guid id,
        ChangeUserStatusDto dto)
    {
        var currentUserId = User.GetUserId();
        await _service.ChangeStatusAsync(id, dto.IsActive, currentUserId);
        return NoContent();
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}