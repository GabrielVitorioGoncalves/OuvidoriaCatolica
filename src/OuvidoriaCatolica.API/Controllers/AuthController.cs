using Microsoft.AspNetCore.Mvc;
using OuvidoriaCatolica.Services;
using static AuthDtos;

namespace OuvidoriaCatolica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _service;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _service = new AuthService(context, configuration);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            try
            {
                var result = _service.Login(request.Email, request.Password);

                return Ok(new 
                { 
                    Token = result.Token, 
                    User = new { result.User.Name, result.User.Email, result.User.Role } 
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Ocorreu um erro interno ao tentar realizar o login." });
            }
        }
    }
}