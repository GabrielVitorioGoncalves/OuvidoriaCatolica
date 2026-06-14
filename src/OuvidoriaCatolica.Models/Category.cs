public class Category
{
    public Category(string name, string description)
    {
        ValidateName(name);
        CategoryID = Guid.NewGuid();
        Name = name;
        Description = description;
        IsActive = true;
    }

    // EF Core
    private Category() {}

    public Guid CategoryID { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; }
    public bool IsActive { get; private set; }

    public void UpdateCategory(string name, string description)
    {
        ValidateName(name);
        Name = name;
        Description = description;
    }

    public void ChangeCategoryStatus(bool isActive)
    {
        IsActive = isActive;
    }

    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Name is required");
        }
    }
}