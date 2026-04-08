namespace InteractHub.Api.DTOs.Stories;

public sealed record StoryResponseDto
{
    public int Id { get; init; }
    public string UserId { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public string? UserAvatarUrl { get; init; }
    public string? Content { get; init; }
    public string? ImageUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime ExpiresAt { get; init; }
}