public class User
{
    public User(string email, string passwordHash, string name, UserRole role)
    {
        UserID = Guid.NewGuid();
        Email = email;
        PasswordHash = passwordHash;
        Name = name;
        Role = role;
        IsActive = true;
        CreatedAt = DateTime.Now;
    }

    public Guid UserID { get; private set; }
    public string Email { get; private set; }
    public string PasswordHash { get; private set; }
    public string Name { get; private set; }
    public UserRole Role { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }

    public void UpdateUser(string email, string name, UserRole role, bool isActive)
    {
        Email = email;
        Name = name;
        Role = role;
        IsActive = isActive;
    }
}

public enum UserRole
{
    Common = 1,
    Attendant = 2,
    Admin = 3
}