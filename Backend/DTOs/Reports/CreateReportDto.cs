namespace InteractHub.Api.DTOs.Reports;

using System.ComponentModel.DataAnnotations;

public sealed record CreateReportDto
{
    [Required]
    [MaxLength(500)]
    public string Reason { get; init; } = string.Empty;
}