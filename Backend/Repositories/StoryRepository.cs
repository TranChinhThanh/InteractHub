namespace InteractHub.Api.Repositories;

using InteractHub.Api.Data;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public sealed class StoryRepository : GenericRepository<Story>, IStoryRepository
{
    private readonly ApplicationDbContext _context;

    public StoryRepository(ApplicationDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Story>> GetActiveStoriesAsync()
    {
        var now = DateTime.UtcNow;

        return await _context.Stories
            .AsNoTracking()
            .Include(s => s.User)
            .Where(s => s.ExpiresAt > now)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }
}