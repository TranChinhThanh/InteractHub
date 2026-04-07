namespace InteractHub.Api.DTOs.Posts;

public sealed record PostResponseDto
{
    public int Id { get; init; }
    public string Content { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public IReadOnlyList<string> Hashtags { get; init; } = Array.Empty<string>();
    public PostAuthorDto Author { get; init; } = new();
}
