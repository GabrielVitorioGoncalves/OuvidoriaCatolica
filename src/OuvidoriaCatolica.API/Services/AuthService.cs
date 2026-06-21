using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using OuvidoriaCatolica.Models; 

namespace OuvidoriaCatolica.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public (string Token, User User) Login(string email, string password)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null || !user.IsActive)
            {
                throw new UnauthorizedAccessException("E-mail ou senha inválidos.");
            }

            if (string.IsNullOrWhiteSpace(user.PasswordHash))
            {
                throw new UnauthorizedAccessException("E-mail não vinculado");
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            if (!isPasswordValid)
            {
                throw new UnauthorizedAccessException("E-mail ou senha inválidos.");
            }

            var token = GenerateJwtToken(user);

            return (token, user);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.ASCII.GetBytes(jwtSettings["SecretKey"]!);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserID.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim("name", user.Name),
                new Claim(ClaimTypes.Role, user.Role.ToString()) 
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(double.Parse(jwtSettings["ExpirationInHours"]!)),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public void CreatePassword(string email, string password, Guid currentUserId)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email);

            if (user == null || !user.IsActive)
            {
                throw new ArgumentException("Usuário inválido ou inativo.");
            }

            if (!string.IsNullOrEmpty(user.PasswordHash))
            {
                throw new InvalidOperationException("Este usuário já possui uma senha cadastrada.");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
            
            user.ChangePasswordHash(passwordHash, currentUserId);
            _context.SaveChanges();
        }
    }
}