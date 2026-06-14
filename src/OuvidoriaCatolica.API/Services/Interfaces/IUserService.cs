using OuvidoriaCatolica.API.DTOs.User;

namespace OuvidoriaCatolica.API.Services.Interfaces;

public interface IUserService
{
    Task<IEnumerable<UserResponseDto>> GetAllAsync();
    Task<UserResponseDto?> GetByIdAsync(Guid id);
    Task<UserResponseDto> CreateAsync(CreateUserDto dto);
    Task UpdateAsync(Guid id, UpdateUserDto dto);
    Task ChangeStatusAsync(Guid id, bool isActive);
    Task DeleteAsync(Guid id);
}