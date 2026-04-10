namespace InteractHub.Api.Repositories;

using InteractHub.Api.Data;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public sealed class CommentRepository : GenericRepository<Comment>, ICommentRepository
{
    private readonly ApplicationDbContext _context;

    public CommentRepository(ApplicationDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Comment>> GetCommentsByPostIdAsync(int postId)
    {
        return await _context.Comments
            .AsNoTracking()
            .Include(comment => comment.User)
            .Where(comment => comment.PostId == postId)
            .OrderByDescending(comment => comment.CreatedAt)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<int>> GetCommentIdsByPostIdAsync(int postId)
    {
        return await _context.Comments
            .AsNoTracking()
            .Where(comment => comment.PostId == postId)
            .Select(comment => comment.Id)
            .ToListAsync();
    }

    public async Task DeleteByPostIdAsync(int postId)
    {
        var comments = await _context.Comments
            .Where(comment => comment.PostId == postId)
            .ToListAsync();

        if (comments.Count == 0)
        {
            return;
        }

        _context.Comments.RemoveRange(comments);
    }
}