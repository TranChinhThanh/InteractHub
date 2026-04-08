namespace InteractHub.Api.Repositories.Interfaces;

using InteractHub.Api.Models;

public interface IPostRepository : IGenericRepository<Post>
{
    Task<IEnumerable<Post>> GetAllPostsWithDetailsAsync();
    Task<Post?> GetPostWithDetailsByIdAsync(int id);
}
