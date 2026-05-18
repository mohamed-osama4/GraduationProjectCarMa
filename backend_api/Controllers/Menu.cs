using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/menu")]
    [Authorize]
    public class MenuController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetMenu()
        {
            var menu = new[]
            {
                new
                {
                    title = "الملف الشخصي",
                    route = "/admin/profile"
                },
                new
                {
                    title = "الإعدادات",
                    route = "/admin/settings"
                }
            };

            return Ok(menu);
        }
    }
}