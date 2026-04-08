namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Stories;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Security;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public sealed class StoriesService : IStoriesService
{
    private readonly IStoryRepository _storyRepository;
    private readonly UserManager<ApplicationUser> _userManager;

    public StoriesService(
        IStoryRepository storyRepository,
        UserManager<ApplicationUser> userManager)
    {
        _storyRepository = storyRepository;
        _userManager = userManager;
    }

    public async Task<StoryResponseDto> CreateStoryAsync(string userId, CreateStoryDto dto)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("UserId is required.");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            throw new InvalidOperationException("User not found.");
        }

        var now = DateTime.UtcNow;

        var story = new Story
        {
            UserId = userId,
            TextContent = NormalizeNullable(dto.Content),
            ImageUrl = NormalizeNullable(dto.ImageUrl),
            CreatedAt = now,
            ExpiresAt = now.AddHours(24),
        };

        try
        {
            await _storyRepository.AddAsync(story);
            await _storyRepository.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new InvalidOperationException("Unable to create story.");
        }

        return ToStoryResponse(story, user);
    }

    public async Task<IEnumerable<StoryResponseDto>> GetActiveStoriesAsync()
    {
        var stories = await _storyRepository.GetActiveStoriesAsync();

        return stories
            .Select(story => ToStoryResponse(story, story.User))
            .ToList();
    }

    public async Task DeleteStoryAsync(int storyId, string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("UserId is required.");
        }

        var actor = await _userManager.FindByIdAsync(userId);
        if (actor is null)
        {
            throw new InvalidOperationException("User not found.");
        }

        var story = await _storyRepository.GetByIdAsync(storyId);
        if (story is null)
        {
            throw new InvalidOperationException("Story not found.");
        }

        var isAdmin = await _userManager.IsInRoleAsync(actor, AppRoles.Admin);
        var isOwner = string.Equals(story.UserId, userId, StringComparison.Ordinal);

        if (!isAdmin && !isOwner)
        {
            throw new UnauthorizedAccessException("You do not have permission to delete this story.");
        }

        try
        {
            _storyRepository.Delete(story);
            await _storyRepository.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new InvalidOperationException("Unable to delete story.");
        }
    }

    private static StoryResponseDto ToStoryResponse(Story story, ApplicationUser? user)
    {
        return new StoryResponseDto
        {
            Id = story.Id,
            UserId = story.UserId,
            UserName = user?.UserName ?? string.Empty,
            UserAvatarUrl = user?.ProfilePictureUrl,
            Content = story.TextContent,
            ImageUrl = story.ImageUrl,
            CreatedAt = story.CreatedAt,
            ExpiresAt = story.ExpiresAt,
        };
    }

    private static string? NormalizeNullable(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return null;
        }

        return value.Trim();
    }
}