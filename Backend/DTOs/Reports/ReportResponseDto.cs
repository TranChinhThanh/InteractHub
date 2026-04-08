namespace InteractHub.Api.DTOs.Reports;

public sealed record ReportResponseDto
{
    public int Id { get; init; }
    public int PostId { get; init; }
    public string ReporterId { get; init; } = string.Empty;
    public string Reason { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}