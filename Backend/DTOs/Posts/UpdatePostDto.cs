namespace InteractHub.Api.DTOs.Posts;

using System.ComponentModel.DataAnnotations;

public sealed record UpdatePostDto
{
    [Required]
    [MaxLength(1000)]
    public string Content { get; init; } = string.Empty;
}
