namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Notifications;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Services.Interfaces;

public sealed class NotificationsService : INotificationsService
{
    private readonly INotificationRepository _notificationRepository;

    public NotificationsService(INotificationRepository notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<IEnumerable<NotificationResponseDto>> GetUserNotificationsAsync(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("UserId is required.");
        }

        var notifications = await _notificationRepository.GetUserNotificationsAsync(userId);

        return notifications
            .Select(ToNotificationResponse)
            .ToList();
    }

    public async Task MarkAsReadAsync(int notificationId, string userId)
    {
        var notification = await _notificationRepository.GetByIdAsync(notificationId);
        if (notification is null)
        {
            throw new InvalidOperationException("Notification not found.");
        }

        if (!string.Equals(notification.UserId, userId, StringComparison.Ordinal))
        {
            throw new UnauthorizedAccessException("You do not have permission to modify this notification.");
        }

        notification.IsRead = true;
        _notificationRepository.Update(notification);
        await _notificationRepository.SaveChangesAsync();
    }

    private static NotificationResponseDto ToNotificationResponse(Notification notification)
    {
        return new NotificationResponseDto
        {
            Id = notification.Id,
            UserId = notification.UserId,
            Type = notification.Type,
            Content = notification.Content,
            IsRead = notification.IsRead,
            RelatedEntityId = notification.RelatedEntityId,
            CreatedAt = notification.CreatedAt,
        };
    }
}