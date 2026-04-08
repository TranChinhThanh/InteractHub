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
            .Include(p => p.User)
            .Include(p => p.Hashtags)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<Post?> GetPostWithDetailsByIdAsync(int id)
    {
        return await _context.Posts
            .Include(p => p.User)
            .Include(p => p.Hashtags)
            .FirstOrDefaultAsync(p => p.Id == id);
    }
}
