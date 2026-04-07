namespace InteractHub.Api.DTOs.Posts;

public sealed record PostResponseDto
{
    public int Id { get; init; }
    public string Content { get; init; } = string.Empty;
    public string? ImageUrl { get; init; }
    public DateTime CreatedAt { get; init; }
    public PostAuthorDto Author { get; init; } = new();
}
