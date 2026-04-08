namespace InteractHub.Api.DTOs.Comments;

public sealed record CommentResponseDto
{
    public int Id { get; init; }
    public int PostId { get; init; }
    public string UserId { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public string? UserAvatarUrl { get; init; }
    public string Content { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}