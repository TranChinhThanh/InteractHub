namespace InteractHub.Api.Repositories.Interfaces;

using InteractHub.Api.Models;

public interface ICommentRepository : IGenericRepository<Comment>
{
    Task<IEnumerable<Comment>> GetCommentsByPostIdAsync(int postId);
    Task<IReadOnlyList<int>> GetCommentIdsByPostIdAsync(int postId);
    Task DeleteByPostIdAsync(int postId);
}