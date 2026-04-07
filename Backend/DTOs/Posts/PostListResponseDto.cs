namespace InteractHub.Api.DTOs.Posts;

public sealed record PostListResponseDto
{
    public IReadOnlyList<PostResponseDto> Items { get; init; } = Array.Empty<PostResponseDto>();
    public int PageNumber { get; init; }
    public int PageSize { get; init; }
    public int TotalCount { get; init; }
}
