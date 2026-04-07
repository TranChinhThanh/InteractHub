namespace InteractHub.Api.DTOs.Posts;

using System.ComponentModel.DataAnnotations;

public sealed record CreatePostDto
{
    [Required]
    [MaxLength(1000)]
    public string Content { get; init; } = string.Empty;
}
