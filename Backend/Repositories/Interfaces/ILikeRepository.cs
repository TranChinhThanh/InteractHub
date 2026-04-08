namespace InteractHub.Api.Repositories.Interfaces;

using InteractHub.Api.Models;

public interface ILikeRepository : IGenericRepository<Like>
{
    Task<Like?> GetPostLikeAsync(int postId, string userId);
    Task<Like?> GetCommentLikeAsync(int commentId, string userId);
}