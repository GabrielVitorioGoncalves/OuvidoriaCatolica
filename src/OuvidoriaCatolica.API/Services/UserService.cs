using Microsoft.EntityFrameworkCore;
using OuvidoriaCatolica.API.DTOs.User;
using OuvidoriaCatolica.API.Services.Interfaces;
using OuvidoriaCatolica.Models;

namespace OuvidoriaCatolica.API.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;
    private readonly AuditService _audit;

    public UserService(AppDbContext context, AuditService audit)
    {
        _context = context;
        _audit = audit;
    }

    public async Task<IEnumerable<UserResponseDto>> GetAllAsync()
    {
        return await _context.Users
            .Select(u => new UserResponseDto
            {
                UserID = u.UserID,
                Email = u.Email,
                Name = u.Name,
                Role = u.Role,
                Sector = u.Sector,
                IsActive = u.IsActive
            })
            .ToListAsync();
    }

    public async Task<UserResponseDto?> GetByIdAsync(Guid id)
    {
        return await _context.Users
            .Where(u => u.UserID == id)
            .Select(u => new UserResponseDto
            {
                UserID = u.UserID,
                Email = u.Email,
                Name = u.Name,
                Role = u.Role,
                Sector = u.Sector,
                IsActive = u.IsActive
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserResponseDto> CreateAsync(CreateUserDto dto, Guid currentUserId)
    {
        var user = new User(
            dto.Email,
            dto.Name,
            dto.Role,
            currentUserId,
            dto.Sector
        );

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        _audit.Log(
            AuditActions.UserCreated, 
            $"Usuário {user.Email} criado com a role {user.Role}.", 
            currentUserId
        );

        return new UserResponseDto
        {
            UserID = user.UserID,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            Sector = user.Sector,
            IsActive = user.IsActive
        };
    }

    public async Task UpdateAsync(Guid id, UpdateUserDto dto, Guid currentUserId)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null)
            throw new Exception("User not found");

        user.UpdateUser(
            dto.Email,
            dto.Name,
            dto.Role,
            dto.Sector,
            currentUserId
        );

        await _context.SaveChangesAsync();

        _audit.Log(
            AuditActions.UserUpdated, 
            $"Dados do usuário {user.Email} foram atualizados.", 
            currentUserId
        );
    }

    public async Task ChangeStatusAsync(Guid id, bool isActive, Guid currentUserId)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null)
            throw new Exception("User not found");

        user.ChangeUserStatus(isActive, currentUserId);

        await _context.SaveChangesAsync();

        var action = isActive ? AuditActions.UserUpdated : AuditActions.UserDeactivated;
        var statusName = isActive ? "Ativado" : "Inativado";
        
        _audit.Log(
            action, 
            $"Status do usuário {user.Email} alterado para {statusName}.", 
            currentUserId
        );
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null)
            throw new Exception("User not found");

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();

        _audit.Log(
            AuditActions.UserDeactivated, 
            $"Usuário {user.Email} foi excluído do banco de dados."
        );
    }
}