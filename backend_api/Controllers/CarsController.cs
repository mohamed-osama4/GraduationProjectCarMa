using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarMaintenance.Data;
using CarMaintenance.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using CarMaintenance.Hubs;
using CarMaintenance.DTOs;
using Swashbuckle.AspNetCore.Annotations;
using CarMaintenance.Services.Interfaces;
using CarMaintenance.DTOs.NewNotifications;
using CarMaintenance.Models.Enums;
using CarMaintenance.Models;
using System.Security.Claims;
namespace CarMaintenance.Controllers
{
[ApiController]
[Route("api/cars")]
[Authorize]
public class CarsController : ControllerBase
{
    private readonly AppDbContext _context;

    public CarsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyCars()
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        );

        var cars = await _context.Cars
            .Where(x => x.UserId == userId)
            .ToListAsync();

        return Ok(cars);
    }

    [HttpPost]
    public async Task<IActionResult> AddCar(Car car)
    {
        var userId = int.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value
        );

        car.UserId = userId;

        _context.Cars.Add(car);

        await _context.SaveChangesAsync();

        return Ok(car);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCar(int id)
    {
        var car = await _context.Cars.FindAsync(id);

        if (car == null)
            return NotFound();

        _context.Cars.Remove(car);

        await _context.SaveChangesAsync();

        return Ok();
    }
}
}