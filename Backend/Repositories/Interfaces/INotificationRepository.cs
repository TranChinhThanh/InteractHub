namespace InteractHub.Api.Repositories.Interfaces;

using InteractHub.Api.Models;

public interface INotificationRepository : IGenericRepository<Notification>
{
    Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId);
    Task<int> DeleteAllByUserIdAsync(string userId);
}