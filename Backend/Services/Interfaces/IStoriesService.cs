namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Stories;

public interface IStoriesService
{
    Task<StoryResponseDto> CreateStoryAsync(string userId, CreateStoryDto dto);
    Task<IEnumerable<StoryResponseDto>> GetActiveStoriesAsync();
    Task DeleteStoryAsync(int storyId, string userId);
}