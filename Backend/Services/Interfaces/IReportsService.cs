namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Reports;

public interface IReportsService
{
    Task<ReportResponseDto> CreateReportAsync(int postId, string reporterId, CreateReportDto dto);
}