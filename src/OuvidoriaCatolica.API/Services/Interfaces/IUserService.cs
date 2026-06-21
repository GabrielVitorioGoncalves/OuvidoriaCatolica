using OuvidoriaCatolica.API.DTOs.User;

namespace OuvidoriaCatolica.API.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetAllAsync();
    Task<UserResponseDto?> GetByIdAsync(Guid id);
    Task<UserResponseDto> CreateAsync(CreateUserDto dto, Guid currentUserId);
    Task UpdateAsync(Guid id, UpdateUserDto dto, Guid currentUserId);
    Task ChangeStatusAsync(Guid id, bool isActive, Guid currentUserId);
    Task DeleteAsync(Guid id);
}