namespace InteractHub.Api.Repositories;

using InteractHub.Api.Data;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public class PostRepository : GenericRepository<Post>, IPostRepository
{
    private readonly ApplicationDbContext _context;

    public PostRepository(ApplicationDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Post>> GetAllPostsWithDetailsAsync()
    {
        return await _context.Posts
            .AsNoTracking()
            .Include(p => p.User)
            .Include(p => p.Comments)
            .Include(p => p.Likes)
            .Include(p => p.Hashtags)
            .OrderByDescending(p => p.CreatedAt)
            .AsSplitQuery()
            .ToListAsync();
    }

    public async Task<int> CountPostsAsync()
    {
        return await _context.Posts.CountAsync();
    }

    public async Task<IEnumerable<Post>> GetPostsPageWithDetailsAsync(int skip, int take)
    {
        return await _context.Posts
            .AsNoTracking()
            .Include(p => p.User)
            .Include(p => p.Comments)
            .Include(p => p.Likes)
            .Include(p => p.Hashtags)
            .OrderByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Take(take)
            .AsSplitQuery()
            .ToListAsync();
    }

    public async Task<IEnumerable<Post>> GetPostsByUserIdAsync(string userId)
    {
        return await _context.Posts
            .AsNoTracking()
            .Where(p => p.UserId == userId)
            .Include(p => p.User)
            .Include(p => p.Comments)
            .Include(p => p.Likes)
            .Include(p => p.Hashtags)
            .OrderByDescending(p => p.CreatedAt)
            .AsSplitQuery()
            .ToListAsync();
    }

    public async Task<Post?> GetPostWithDetailsByIdAsync(int id)
    {
        return await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Comments)
            .Include(p => p.Likes)
            .Include(p => p.Hashtags)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}
