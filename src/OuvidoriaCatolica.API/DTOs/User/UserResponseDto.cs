using OuvidoriaCatolica.Models;

namespace OuvidoriaCatolica.API.DTOs.User;

public class UserResponseDto
{
    public Guid UserID { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public UserRole Role { get; set; }
    public bool IsActive { get; set; }
}