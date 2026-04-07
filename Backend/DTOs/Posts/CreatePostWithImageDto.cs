namespace InteractHub.Api.DTOs.Posts;

using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

public sealed record CreatePostWithImageDto
{
    [Required]
    [MaxLength(1000)]
    public string Content { get; init; } = string.Empty;

    [Required]
    public IFormFile Image { get; init; } = default!;
}
