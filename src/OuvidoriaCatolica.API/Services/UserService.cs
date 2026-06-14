using Microsoft.EntityFrameworkCore;
using OuvidoriaCatolica.API.DTOs.User;
using OuvidoriaCatolica.API.Services.Interfaces;
using OuvidoriaCatolica.Models;

namespace OuvidoriaCatolica.API.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
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
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
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
                IsActive = u.IsActive,
                CreatedAt = u.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserResponseDto> CreateAsync(CreateUserDto dto)
    {
        var user = new User(
            dto.Email,
            dto.Password,
            dto.Name,
            dto.Role
        );

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return new UserResponseDto
        {
            UserID = user.UserID,
            Email = user.Email,
            Name = user.Name,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }

    public async Task UpdateAsync(Guid id, UpdateUserDto dto)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null)
            throw new Exception("User not found");

        user.UpdateUser(
            dto.Email,
            dto.Name,
            dto.Role
        );

        await _context.SaveChangesAsync();
    }

    public async Task ChangeStatusAsync(Guid id, bool isActive)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null)
            throw new Exception("User not found");

        user.ChangeUserStatus(isActive);

        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user is null)
            throw new Exception("User not found");

        _context.Users.Remove(user);

        await _context.SaveChangesAsync();
    }
}