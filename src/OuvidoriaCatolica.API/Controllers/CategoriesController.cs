using Microsoft.AspNetCore.Mvc;
using static CategoryDtos;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _service;

    public CategoriesController(AppDbContext context)
    {
        _service = new CategoryService(context);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var categories = await _service.GetAllCategoriesAsync();
            return Ok(categories);
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar as categorias." });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var category = await _service.GetCategoryByIdAsync(id);
            
            if (category == null)
                return NotFound(new { message = "Categoria não encontrada." });

            return Ok(category);
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar a categoria." });
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
    {
        try
        {
            var createdCategory = await _service.CreateCategoryAsync(request);

            return StatusCode(201, createdCategory);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao criar a categoria." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateCategoryRequest request)
    {
        try
        {
            await _service.UpdateCategoryAsync(id, request);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao atualizar a categoria." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _service.DeactivateCategoryAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Ocorreu um erro interno ao desativar a categoria." });
        }
    }
}