using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarMaintenance.Data;
using Swashbuckle.AspNetCore.Annotations;


namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestItemsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TestItemsController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get all test items from the database.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<CarMaintenance.Models.TestItem>), 200)]
        [ProducesResponseType(500)]
        [SwaggerOperation(
            Summary = "Get All Test Items",
            Description = "Retrieves all test items from the database. Returns 500 if a database error occurs."
        )]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var items = await _context.TestItems.ToListAsync();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}