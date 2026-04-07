namespace InteractHub.Api.DTOs.Auth;

using System.ComponentModel.DataAnnotations;

public sealed record RegisterDto
{
    [Required]
    [MinLength(3)]
    public string Username { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; init; } = string.Empty;

    [Required]
    [MinLength(2)]
    public string FullName { get; init; } = string.Empty;
}
