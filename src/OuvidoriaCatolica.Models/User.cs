public class User
{
    public User(string email, string passwordHash, string name, UserRole role)
    {
        ValidateInput(email, name);
        ValidatePasswordHash(passwordHash);
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

    public void UpdateUser(string email, string name, UserRole role)
    {
        ValidateInput(email, name);
        Email = email;
        Name = name;
        Role = role;
    }

    public void ChangeUserStatus(bool isActive)
    {
        IsActive = isActive;
    }

    public void ChangePasswordHash(string passwordHash)
    {
        ValidatePasswordHash(passwordHash);
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

    private static void ValidatePasswordHash(string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
        {
            throw new ArgumentException("Password hash is required");
        }
    }
}

public enum UserRole
{
    Common = 1,
    Attendant = 2,
    Admin = 3
}