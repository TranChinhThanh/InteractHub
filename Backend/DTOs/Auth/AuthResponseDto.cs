namespace InteractHub.Api.DTOs.Auth;

public sealed record AuthResponseDto
{
    public string Token { get; init; } = string.Empty;
    public string UserId { get; init; } = string.Empty;
    public string Username { get; init; } = string.Empty;
    public DateTime ExpiresAtUtc { get; init; }
}
