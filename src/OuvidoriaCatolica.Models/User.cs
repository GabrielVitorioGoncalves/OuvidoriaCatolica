namespace OuvidoriaCatolica.Models;

public class User
{
    public User(string email, string name, UserRole role, Sector? sector = null)
    {
        ValidateInput(email, name);
        UserID = Guid.NewGuid();
        Email = email;
        Name = name;
        Role = role;
        Sector = sector;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
    }

    // EF Core
    private User() {}

    public Guid UserID { get; private set; }
    public string Email { get; private set; }
    public string? PasswordHash { get; private set; }
    public string Name { get; private set; }
    public UserRole Role { get; private set; }
    public Sector? Sector { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public void UpdateUser(string email, string name, UserRole role, Sector sector)
    {
        ValidateInput(email, name);
        Email = email;
        Name = name;
        Role = role;
        Sector = sector;
    }

    public void ChangeUserStatus(bool isActive)
    {
        IsActive = isActive;
    }

    public void ChangePasswordHash(string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            throw new ArgumentException("Password hash is required");
        }
        PasswordHash = passwordHash;
    }

    private static void ValidateInput(string email, string name)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("Email is required");
        }
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name is required");
        }
    }
}

public enum UserRole
{
    Common = 1,
    Attendant = 2,
    Admin = 3
}
