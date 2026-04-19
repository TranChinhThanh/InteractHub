namespace InteractHub.Api.Repositories;

using InteractHub.Api.Data;
using InteractHub.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public sealed class HashtagRepository : IHashtagRepository
{
    private readonly ApplicationDbContext _context;

    public HashtagRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<string>> GetTrendingHashtagsAsync(int limit)
    {
        var safeLimit = limit < 1 ? 5 : limit;

        return await _context.Hashtags
            .AsNoTracking()
            .Where(hashtag => hashtag.Posts.Any())
            .OrderByDescending(hashtag => hashtag.Posts.Count)
            .ThenBy(hashtag => hashtag.Name)
            .Take(safeLimit)
            .Select(hashtag => hashtag.Name)
            .ToListAsync();
    }
}
