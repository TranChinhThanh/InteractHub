namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Notifications;

public interface INotificationsService
{
    Task<IEnumerable<NotificationResponseDto>> GetUserNotificationsAsync(string userId);
    Task MarkAsReadAsync(int notificationId, string userId);
    Task DeleteAsync(int notificationId, string userId);
    Task<int> DeleteAllAsync(string userId);
}