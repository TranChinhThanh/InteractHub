namespace InteractHub.Api.DTOs.Stories;

using System.ComponentModel.DataAnnotations;

public sealed record CreateStoryDto
{
    [MaxLength(500)]
    public string? Content { get; init; }

    public string? ImageUrl { get; init; }
}