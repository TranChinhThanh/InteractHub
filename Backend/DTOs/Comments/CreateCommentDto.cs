namespace InteractHub.Api.DTOs.Comments;

using System.ComponentModel.DataAnnotations;

public sealed record CreateCommentDto
{
    [Required]
    [MaxLength(500)]
    public string Content { get; init; } = string.Empty;
}