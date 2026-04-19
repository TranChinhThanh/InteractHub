namespace InteractHub.Api.Services.Interfaces;

public interface IHashtagsService
{
    Task<List<string>> GetTrendingHashtagsAsync(int limit);
}
