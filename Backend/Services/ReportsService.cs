namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Reports;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Services.Interfaces;

public sealed class ReportsService : IReportsService
{
    private readonly IReportRepository _reportRepository;
    private readonly IPostRepository _postRepository;

    public ReportsService(
        IReportRepository reportRepository,
        IPostRepository postRepository)
    {
        _reportRepository = reportRepository;
        _postRepository = postRepository;
    }

    public async Task<ReportResponseDto> CreateReportAsync(int postId, string reporterId, CreateReportDto dto)
    {
        if (string.IsNullOrWhiteSpace(reporterId))
        {
            throw new ArgumentException("ReporterId is required.");
        }

        if (dto is null)
        {
            throw new ArgumentException("Report payload is required.");
        }

        var post = await _postRepository.GetByIdAsync(postId);
        if (post is null)
        {
            throw new InvalidOperationException("Post not found.");
        }

        var report = new PostReport
        {
            PostId = postId,
            ReporterId = reporterId,
            Reason = dto.Reason.Trim(),
            CreatedAt = DateTime.UtcNow,
        };

        await _reportRepository.AddAsync(report);
        await _reportRepository.SaveChangesAsync();

        return ToReportResponse(report);
    }

    private static ReportResponseDto ToReportResponse(PostReport report)
    {
        return new ReportResponseDto
        {
            Id = report.Id,
            PostId = report.PostId,
            ReporterId = report.ReporterId,
            Reason = report.Reason,
            CreatedAt = report.CreatedAt,
        };
    }
}