namespace InteractHub.Api.DTOs.Likes;

public sealed record ToggleLikeResponseDto
{
    public bool IsLiked { get; init; }
}