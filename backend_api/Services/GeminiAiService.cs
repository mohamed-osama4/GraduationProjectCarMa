using System.Text;
using System.Text.Json;

namespace CarMaintenance.Services
{
    public class GeminiAiService
    {
private readonly string _apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
        
        private readonly string _apiUrl =
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";        public async Task<string> GetSmartAssistantResponse(string userMessage)
        {
            using var client = new HttpClient();

            var requestUrl = $"{_apiUrl}?key={_apiKey}";

            string systemPrompt = @"
  أنت مساعد ذكي وموظف خدمة عملاء في تطبيق لخدمات السيارات. مهمتك الرد على المستخدمين ومساعدتهم بناءً على حالتهم. 
            التزم بالقواعد التالية حرفياً:
            1. إذا كان المستخدم يتحدث عن عطل في الطريق، حادث، إطار مثقوب، أو سيارة لا تعمل: تعاطف معه، انصحه بطلب ونش إنقاذ، ويجب أن تنهي رسالتك بهذه الكلمة بالضبط: [WINCH_BUTTON] OR [MAINTENANCE_BUTTON]]
            2. إذا كان المستخدم يسأل عن نظافة السيارة أو يطلب غسيل: انصحه بخدمة الغسيل المتنقل، ويجب أن تنهي رسالتك بهذه الكلمة بالضبط: [WASH_BUTTON]
            3. إذا كان المستخدم يسأل عن صيانة، تغيير زيت، أو أصوات غريبة في المحرك: انصحه بطلب خدمة صيانة، ويجب أن تنهي رسالتك بهذه الكلمة بالضبط: [MAINTENANCE_BUTTON]
            4. إذا كانت مجرد تحية أو استفسار عام: رد بلباقة وبشكل مختصر بدون كتابة أي من الكلمات السابقة.
            اغلب مشاكل الاطارات ممكن نبعتله فني مش لازم ونش ف ممكن تعرضي عليه الاتنين و تحطي زرار اطلب فني جنب الونش ف action 
            اجعل ردودك قصيرة، عملية، وباللهجة المصرية.
";

            var fullPrompt = systemPrompt + "\nUser: " + userMessage;

            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = fullPrompt }
                        }
                    }
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            try
            {
                var response = await client.PostAsync(requestUrl, content);
                var responseString = await response.Content.ReadAsStringAsync();

                // 🔥 مهم: إظهار الخطأ الحقيقي لو حصل
                if (!response.IsSuccessStatusCode)
                {
                    return $"API ERROR {response.StatusCode}: {responseString}";
                }

                using JsonDocument doc = JsonDocument.Parse(responseString);

                var text = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                return text;
            }
            catch (Exception ex)
            {
                return $"ERROR: {ex.Message}";
            }
        }
    }
}