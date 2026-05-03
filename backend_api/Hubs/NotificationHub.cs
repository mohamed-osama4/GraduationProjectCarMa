using Microsoft.AspNetCore.SignalR;

namespace CarMaintenance.Hubs
{
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.Identity?.Name;

            if (userId != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }

            await base.OnConnectedAsync();
        }
    }
}