namespace InteractHub.Api.Repositories;

using InteractHub.Api.Data;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public sealed class LikeRepository : GenericRepository<Like>, ILikeRepository
{
    private readonly ApplicationDbContext _context;

    public LikeRepository(ApplicationDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task<Like?> GetPostLikeAsync(int postId, string userId)
    {
        return await _context.Likes
            .AsNoTracking()
            .FirstOrDefaultAsync(like => like.PostId == postId && like.UserId == userId);
    }

    public async Task<Like?> GetCommentLikeAsync(int commentId, string userId)
    {
        return await _context.Likes
            .AsNoTracking()
            .FirstOrDefaultAsync(like => like.CommentId == commentId && like.UserId == userId);
    }

    public async Task DeleteByPostIdAsync(int postId)
    {
        var likes = await _context.Likes
            .Where(like => like.PostId == postId)
            .ToListAsync();

        if (likes.Count == 0)
        {
            return;
        }

        _context.Likes.RemoveRange(likes);
    }

    public async Task DeleteByCommentIdsAsync(IReadOnlyCollection<int> commentIds)
    {
        if (commentIds.Count == 0)
        {
            return;
        }

        var likes = await _context.Likes
            .Where(like => like.CommentId.HasValue && commentIds.Contains(like.CommentId.Value))
            .ToListAsync();

        if (likes.Count == 0)
        {
            return;
        }

        _context.Likes.RemoveRange(likes);
    }
}