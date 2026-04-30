using Microsoft.AspNetCore.Mvc;

namespace CarServiceAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var users = new List<User>
            {
                new User { Id = 1, Name = "Menna", Email = "menna@gmail.com", Password = "1234", Role = "customer" },
                new User { Id = 2, Name = "Ahmed", Email = "ahmed@gmail.com", Password = "5678", Role = "technician" },
                new User { Id = 3, Name = "Abdelrahman", Email = "Elmongy@gmail.com", Password = "1122", Role = "admin" }

            };

            var user = users.FirstOrDefault(u => u.Email == request.Email);

            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            if (user.Password != request.Password)
            {
                return Unauthorized(new { message = "Wrong password" });
            }

            return Ok(new
            {
                message = "Login successful",
                user.Id,
                user.Name,
                user.Email,
                user.Role
            });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }
}