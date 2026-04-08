namespace InteractHub.Api.Repositories;

using InteractHub.Api.Data;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public sealed class ConnectionRepository : GenericRepository<Connection>, IConnectionRepository
{
    private readonly ApplicationDbContext _context;

    public ConnectionRepository(ApplicationDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Connection>> GetUserConnectionsAsync(string userId)
    {
        return await _context.Connections
            .Include(c => c.Follower)
            .Include(c => c.Followee)
            .Where(c => c.FollowerId == userId || c.FolloweeId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Connection?> GetConnectionAsync(string followerId, string followeeId)
    {
        return await _context.Connections
            .Include(c => c.Follower)
            .Include(c => c.Followee)
            .FirstOrDefaultAsync(c => c.FollowerId == followerId && c.FolloweeId == followeeId);
    }
}