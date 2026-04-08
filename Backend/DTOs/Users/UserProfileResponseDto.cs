namespace InteractHub.Api.DTOs.Users;

public sealed class UserProfileResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime DateJoined { get; set; }
    public string Role { get; set; } = string.Empty;
}