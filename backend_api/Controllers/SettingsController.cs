
using CarMaintenance.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using CarMaintenance.DTOs;
using CarMaintenance.Models;
using Swashbuckle.AspNetCore.Annotations;
namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SettingsController(AppDbContext context)
        {
            _context = context;
        }

        // Get settings for logged user
        [HttpGet("MySettings")]
        public async Task<IActionResult> GetSettings()
        {
var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

if (userIdClaim == null)
    return Unauthorized();

int userId = int.Parse(userIdClaim);
            var settings = await _context.UserSettings
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (settings == null)
                return NotFound();

            return Ok(settings);
        }

        // Update settings for logged user
        [HttpPut("Update-Settings")]
        public async Task<IActionResult> UpdateSettings(UpdateSettingsDto dto)
        {
var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

if (userIdClaim == null)
    return Unauthorized();

int userId = int.Parse(userIdClaim);
            var settings = await _context.UserSettings
                .FirstOrDefaultAsync(x => x.UserId == userId);

            if (settings == null)
                return NotFound();

            settings.EmailNotifications = dto.EmailNotifications;
            settings.SmsNotifications = dto.SmsNotifications;
            settings.PromotionalOffers = dto.PromotionalOffers;
            settings.TwoFactorEnabled = dto.TwoFactorEnabled;
            settings.BiometricsEnabled = dto.BiometricsEnabled;

            await _context.SaveChangesAsync();

            return Ok(settings);
        }
    }
}