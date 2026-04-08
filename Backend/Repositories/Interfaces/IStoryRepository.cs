namespace InteractHub.Api.Repositories.Interfaces;

using InteractHub.Api.Models;

public interface IStoryRepository : IGenericRepository<Story>
{
    Task<IEnumerable<Story>> GetActiveStoriesAsync();
}