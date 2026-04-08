namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Notifications;

public interface INotificationsService
{
    Task<IEnumerable<NotificationResponseDto>> GetUserNotificationsAsync(string userId);
    Task MarkAsReadAsync(int notificationId, string userId);
}