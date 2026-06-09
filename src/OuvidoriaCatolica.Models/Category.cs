public class Category
{
    public Category(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new InvalidOperationException("Category name cannot be null or empty");
        }
        CategoryID = Guid.NewGuid();
        Name = name;
        IsActive = true;
    }

    public Guid CategoryID { get; private set; }
    public string Name { get; private set; }
    public bool IsActive { get; private set; }

    public void UpdateCategory(string name, bool isActive)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new InvalidOperationException("Category name cannot be null or empty");
        }
        Name = name;
        IsActive = isActive;
    }
}