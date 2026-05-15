using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using CarMaintenance.Data;
using CarMaintenance.Models;
using CarMaintenance.DTOs;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/admin/workshops")]
    [Authorize(Roles = "admin")]
    public class WorkshopsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkshopsController(AppDbContext context)
        {
            _context = context;
        }

        // ─── GET ALL ───────────────────────────────────────
        [HttpGet]
        [SwaggerOperation(Summary = "Get all workshops")]
        public async Task<IActionResult> GetAll()
        {
            var workshops = await _context.Workshops
                .Include(w => w.Services)
                .OrderByDescending(w => w.CreatedAt)
                .Select(w => new
                {
                    w.Id,
                    w.Name,
                    w.OwnerName,
                    w.PhoneNumber,
                    w.Email,
                    w.Address,
                    OpenTime = w.OpenTime.ToString(@"hh\:mm\:ss"),
                    CloseTime = w.CloseTime.ToString(@"hh\:mm\:ss"),
                    w.IsOpen,
                    Services = w.Services.Select(s => new { s.Id, s.Name }),
                    w.JoinDate,
                    w.TotalOrders,
                    w.IsActive,
                    w.CreatedAt
                })
                .ToListAsync();

            var totalOrders = workshops.Sum(w => w.TotalOrders);
            var openCount = workshops.Count(w => w.IsOpen && w.IsActive);
            var stoppedCount = workshops.Count(w => !w.IsActive);

            return Ok(new
            {
                success = true,
                data = new
                {
                    workshops,
                    stats = new
                    {
                        total = workshops.Count,
                        open = openCount,
                        stopped = stoppedCount,
                        totalOrders
                    }
                }
            });
        }

        // ─── GET BY ID ─────────────────────────────────────
        [HttpGet("{id}")]
        [SwaggerOperation(Summary = "Get workshop by ID")]
        public async Task<IActionResult> GetById(int id)
        {
            var workshop = await _context.Workshops
                .Include(w => w.Services)
                .FirstOrDefaultAsync(w => w.Id == id);
            if (workshop == null)
                return NotFound(new { success = false, message = "الورشة غير موجودة" });

            return Ok(new
            {
                success = true,
                data = new
                {
                    workshop.Id,
                    workshop.Name,
                    workshop.OwnerName,
                    workshop.PhoneNumber,
                    workshop.Email,
                    workshop.Address,
                    OpenTime = workshop.OpenTime.ToString(@"hh\:mm"),
                    CloseTime = workshop.CloseTime.ToString(@"hh\:mm"),
                    workshop.IsOpen,
                    Services = workshop.Services.Select(s => new { s.Id, s.Name }),
                    workshop.JoinDate,
                    workshop.TotalOrders,
                    workshop.IsActive,
                    workshop.CreatedAt
                }
            });
        }

        // ─── CREATE ────────────────────────────────────────
        [HttpPost]
        [SwaggerOperation(Summary = "Create a new workshop")]
        public async Task<IActionResult> Create([FromBody] CreateWorkshopDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Check duplicate email
            if (await _context.Workshops.AnyAsync(w => w.Email.ToLower() == dto.Email.ToLower()))
                return BadRequest(new { success = false, message = "البريد الإلكتروني مسجل بالفعل لورشة أخرى" });

            var workshop = new Workshop
            {
                Name = dto.Name,
                OwnerName = dto.OwnerName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                Address = dto.Address,
                OpenTime = dto.OpenTime,
                CloseTime = dto.CloseTime,
                JoinDate = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            if (dto.ServiceIds != null && dto.ServiceIds.Any())
            {
                var services = await _context.Services.Where(s => dto.ServiceIds.Contains(s.Id)).ToListAsync();
                workshop.Services = services;
            }

            _context.Workshops.Add(workshop);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "تم إنشاء الورشة بنجاح", data = new { workshop.Id } });
        }

        // ─── UPDATE ────────────────────────────────────────
        [HttpPut("{id}")]
        [SwaggerOperation(Summary = "Update an existing workshop")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateWorkshopDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var workshop = await _context.Workshops
                .Include(w => w.Services)
                .FirstOrDefaultAsync(w => w.Id == id);

            if (workshop == null)
                return NotFound(new { success = false, message = "الورشة غير موجودة" });

            // Check duplicate email (exclude self)
            if (await _context.Workshops.AnyAsync(w => w.Email.ToLower() == dto.Email.ToLower() && w.Id != id))
                return BadRequest(new { success = false, message = "البريد الإلكتروني مسجل بالفعل لورشة أخرى" });

            workshop.Name = dto.Name;
            workshop.OwnerName = dto.OwnerName;
            workshop.PhoneNumber = dto.PhoneNumber;
            workshop.Email = dto.Email;
            workshop.Address = dto.Address;
            workshop.OpenTime = dto.OpenTime;
            workshop.CloseTime = dto.CloseTime;

            workshop.Services.Clear();
            if (dto.ServiceIds != null && dto.ServiceIds.Any())
            {
                var services = await _context.Services.Where(s => dto.ServiceIds.Contains(s.Id)).ToListAsync();
                foreach (var s in services)
                {
                    workshop.Services.Add(s);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "تم تحديث الورشة بنجاح" });
        }

        // ─── DELETE ────────────────────────────────────────
        [HttpDelete("{id}")]
        [SwaggerOperation(Summary = "Delete a workshop")]
        public async Task<IActionResult> Delete(int id)
        {
            var workshop = await _context.Workshops.FindAsync(id);
            if (workshop == null)
                return NotFound(new { success = false, message = "الورشة غير موجودة" });

            _context.Workshops.Remove(workshop);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, message = "تم حذف الورشة بنجاح" });
        }

        // ─── TOGGLE OPEN/CLOSED ────────────────────────────
        [HttpPatch("{id}/toggle-status")]
        [SwaggerOperation(Summary = "Toggle workshop open/closed status")]
        public async Task<IActionResult> ToggleStatus(int id)
        {
            var workshop = await _context.Workshops.FindAsync(id);
            if (workshop == null)
                return NotFound(new { success = false, message = "الورشة غير موجودة" });

            workshop.IsOpen = !workshop.IsOpen;
            await _context.SaveChangesAsync();

            var label = workshop.IsOpen ? "مفتوحة" : "مغلقة";
            return Ok(new { success = true, message = $"الورشة الآن {label}", isOpen = workshop.IsOpen });
        }

        // ─── TOGGLE ACTIVE (stop / reactivate) ─────────────
        [HttpPatch("{id}/toggle-active")]
        [SwaggerOperation(Summary = "Stop or reactivate a workshop")]
        public async Task<IActionResult> ToggleActive(int id)
        {
            var workshop = await _context.Workshops.FindAsync(id);
            if (workshop == null)
                return NotFound(new { success = false, message = "الورشة غير موجودة" });

            workshop.IsActive = !workshop.IsActive;
            await _context.SaveChangesAsync();

            var label = workshop.IsActive ? "نشطة" : "متوقفة";
            return Ok(new { success = true, message = $"الورشة الآن {label}", isActive = workshop.IsActive });
        }
    }
}
