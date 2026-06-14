using Microsoft.EntityFrameworkCore;
using OuvidoriaCatolica.Models;
using static CategoryDtos;

namespace OuvidoriaCatolica.API.Services;

public class CategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
    {
        return await _context.Categories.AsNoTracking().ToListAsync();
    }

    public async Task<Category?> GetCategoryByIdAsync(Guid id)
    {
        return await _context.Categories.FindAsync(id);
    }

    public async Task<Category> CreateCategoryAsync(CreateCategoryRequest request)
    {
        var category = new Category(request.Name, request.Description);

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return category;
    }

    public async Task UpdateCategoryAsync(Guid id, UpdateCategoryRequest request)
    {
        var category = await _context.Categories.FindAsync(id);
        
        if (category == null)
            throw new KeyNotFoundException("Category not found");

        category.UpdateCategory(request.Name, request.Description);

        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteCategoryAsync(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        
        if (category == null)
            throw new KeyNotFoundException("Category not found");

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
    }

    public async Task ChangeCategoryStatusAsync(Guid id, bool isActive)
    {
        var category = await _context.Categories.FindAsync(id);
        
        if (category == null)
            throw new KeyNotFoundException("Category not found");

        category.ChangeCategoryStatus(isActive);

        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
    }
}