namespace InteractHub.Api.DTOs.Posts;

public sealed record PostResponseDto
{
    public int Id { get; init; }
    public string UserId { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public string? UserAvatarUrl { get; init; }
    public string Content { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public int LikeCount { get; init; }
    public bool IsLikedByCurrentUser { get; init; }
    public int CommentCount { get; init; }
    public IReadOnlyList<string> Hashtags { get; init; } = Array.Empty<string>();
    public PostAuthorDto Author { get; init; } = new();
}
