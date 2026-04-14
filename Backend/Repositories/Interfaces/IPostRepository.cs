namespace InteractHub.Api.Repositories.Interfaces;

using InteractHub.Api.Models;

public interface IPostRepository : IGenericRepository<Post>
{
    Task<int> CountPostsAsync();
    Task<IEnumerable<Post>> GetPostsPageWithDetailsAsync(int skip, int take);
    Task<IEnumerable<Post>> GetAllPostsWithDetailsAsync();
    Task<Post?> GetPostWithDetailsByIdAsync(int id);
}
