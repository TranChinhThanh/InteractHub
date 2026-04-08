namespace InteractHub.Api.Repositories.Interfaces;

using InteractHub.Api.Models;

public interface IConnectionRepository : IGenericRepository<Connection>
{
    Task<IEnumerable<Connection>> GetUserConnectionsAsync(string userId);
    Task<Connection?> GetConnectionAsync(string followerId, string followeeId);
}