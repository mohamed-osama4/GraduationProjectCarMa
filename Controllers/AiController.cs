using Microsoft.AspNetCore.Mvc;
using CarMaintenance.Services;
using CarMaintenance.Models;
using Microsoft.AspNetCore.Authorization;

namespace CarMaintenance.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        private readonly GeminiAiService _aiService;

        public AiController(GeminiAiService aiService)
        {
            _aiService = aiService;
        }

        [Authorize]
        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            var reply = await _aiService.GetSmartAssistantResponse(request.Message);

            return Ok(new
            {
                success = true,
                data = reply
            });
        }
    }
}