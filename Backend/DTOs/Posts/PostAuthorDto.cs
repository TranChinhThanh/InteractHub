namespace InteractHub.Api.DTOs.Posts;

public sealed record PostAuthorDto
{
    public string Id { get; init; } = string.Empty;
    public string Username { get; init; } = string.Empty;
    public string? FullName { get; init; }
}
