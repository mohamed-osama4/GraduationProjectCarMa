using System.Text;
using System.Text.Json;

namespace CarMaintenance.Services
{
    public class GeminiAiService
    {
        private readonly string _apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");

        private readonly string _apiUrl =
"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";      public async Task<string> GetSmartAssistantResponse(string userMessage)
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

              
                if (!response.IsSuccessStatusCode)
                {
                    return HandleGeminiError(response.StatusCode.ToString(), responseString, userMessage);
                }

                using JsonDocument doc = JsonDocument.Parse(responseString);

                var text = doc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                return text ?? "مفيش رد من AI دلوقتي";
            }
            catch
            {
                return GetFallbackResponse(userMessage);
            }
        }

       
        private string HandleGeminiError(string status, string response, string message)
        {
            if (response.Contains("429") || response.Contains("RESOURCE_EXHAUSTED"))
            {
                return GetFallbackResponse(message);
            }

            return $"AI ERROR ({status}) - حاول مرة تانية";
        }

        private string GetFallbackResponse(string message)
        {
            message = message.ToLower();

            if (message.Contains("عطل") || message.Contains("مش شغالة") || message.Contains("عربية"))
            {
                return "غالبًا المشكلة في البطارية أو الكهرباء أو البنزين. حاول تتأكد أو اطلب فني صيانة [MAINTENANCE_BUTTON]";
            }

            if (message.Contains("ونش") || message.Contains("حادث"))
            {
                return "يبدو إن الحالة تحتاج ونش إنقاذ فورًا. اطلب خدمة الطوارئ [WINCH_BUTTON]";
            }

            if (message.Contains("زيت"))
            {
                return "يفضل تغيير الزيت كل 5000 - 10000 كم حسب الاستخدام. ممكن تطلب صيانة [MAINTENANCE_BUTTON]";
            }

            if (message.Contains("غسيل"))
            {
                return "نقدر نوصلك خدمة غسيل متنقل في أي مكان [WASH_BUTTON]";
            }

            return "حاليًا خدمة الذكاء الاصطناعي مش متاحة، لكن ممكن أوصفلك الحل لو شرحت المشكلة أكتر.";
        }
    }
}