using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OuvidoriaCatolica.API.Extensions;
using OuvidoriaCatolica.Services;
using static AuthDtos;

namespace OuvidoriaCatolica.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _service;

        public AuthController(AuthService authService)
        {
            _service = authService;
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
                    User = new { result.User.Name, result.User.Email, result.User.Role, result.User.Sector } 
                });
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Ocorreu um erro interno ao tentar realizar o login." });
            }
        }

        [HttpPost("create-password")]
        public IActionResult CreatePassword([FromBody] CreatePasswordRequest request)
        {
            try
            {
                _service.CreatePassword(request.Email, request.Password, Guid.Empty); 
                
                return Ok(new { message = "Senha cadastrada com sucesso. Você já pode realizar o login." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new 
                { 
                    message = "Ocorreu um erro interno ao tentar cadastrar a senha.",
                    erroReal = ex.Message,
                    erroProfundo = ex.InnerException?.Message
                });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult GetMe()
        {
            try
            {
                var currentUserId = User.GetUserId();
                var loggedUser = _service.GetLoggedUser(currentUserId);
                return Ok(loggedUser);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Ocorreu um erro interno ao buscar as informações do usuário logado." });
            }
        }
    }
}