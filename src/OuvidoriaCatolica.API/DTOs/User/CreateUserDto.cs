using OuvidoriaCatolica.Models;

namespace OuvidoriaCatolica.API.DTOs.User;

public class CreateUserDto
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public UserRole Role { get; set; }
}