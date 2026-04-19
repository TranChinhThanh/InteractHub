namespace InteractHub.Api.Repositories.Interfaces;

public interface IHashtagRepository
{
    Task<IEnumerable<string>> GetTrendingHashtagsAsync(int limit);
}
