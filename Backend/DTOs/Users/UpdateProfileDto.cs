using System.ComponentModel.DataAnnotations;

namespace InteractHub.Api.DTOs.Users;

public sealed class UpdateProfileDto
{
    [MaxLength(500)]
    public string? Bio { get; set; }

    [Url]
    [MaxLength(1000)]
    public string? AvatarUrl { get; set; }
}
