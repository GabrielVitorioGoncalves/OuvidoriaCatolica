namespace OuvidoriaCatolica.Models;

public class User
{
    public User(string email, string name, UserRole role, Guid createdBy, Sector? sector = null)
    {
        ValidateInput(email, name);
        UserID = Guid.NewGuid();
        Email = email;
        Name = name;
        Role = role;
        Sector = sector;
        IsActive = true;
        CreatedBy = createdBy;
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
    public DateTime? CreatedAt { get; private set; }
    public Guid? CreatedBy { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public Guid? UpdatedBy { get; private set; }

    public void UpdateUser(string email, string name, UserRole role, Sector sector, Guid updatedBy)
    {
        ValidateInput(email, name);
        Email = email;
        Name = name;
        Role = role;
        Sector = sector;
        RegisterUpdate(updatedBy);
    }

    public void ChangeUserStatus(bool isActive, Guid updatedBy)
    {
        IsActive = isActive;
        RegisterUpdate(updatedBy);
    }

    public void ChangePasswordHash(string passwordHash, Guid updatedBy)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            throw new ArgumentException("Password hash is required");
        }
        PasswordHash = passwordHash;
        RegisterUpdate(updatedBy);
    }

    private void RegisterUpdate(Guid updatedBy)
    {
        UpdatedBy = updatedBy;
        UpdatedAt = DateTime.UtcNow;
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
