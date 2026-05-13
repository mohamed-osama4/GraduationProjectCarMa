
using CarMaintenance.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CarMaintenance.Models;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CarMaintenance.DTOs;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/change-password")]
    [Authorize]
    public class ChangePasswordController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChangePasswordController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim);
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound();

            if (user.PasswordHash != dto.CurrentPassword)
                return BadRequest("Wrong password");

            if (dto.NewPassword != dto.ConfirmPassword)
                return BadRequest("Passwords do not match");

            user.PasswordHash = dto.NewPassword;

            await _context.SaveChangesAsync();

            return Ok("Password changed successfully");
        }
    }
}