namespace InteractHub.Api.Services;

using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Services.Interfaces;

public sealed class HashtagsService : IHashtagsService
{
    private const int DefaultLimit = 5;
    private const int MaxLimit = 20;

    private readonly IHashtagRepository _hashtagRepository;

    public HashtagsService(IHashtagRepository hashtagRepository)
    {
        _hashtagRepository = hashtagRepository;
    }

    public async Task<List<string>> GetTrendingHashtagsAsync(int limit)
    {
        var safeLimit = limit < 1 ? DefaultLimit : Math.Min(limit, MaxLimit);
        var hashtags = await _hashtagRepository.GetTrendingHashtagsAsync(safeLimit);
        return hashtags.ToList();
    }
}
