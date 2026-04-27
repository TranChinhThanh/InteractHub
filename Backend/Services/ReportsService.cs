namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Reports;
using InteractHub.Api.Hubs;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Security;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

public sealed class ReportsService : IReportsService
{
    private readonly IReportRepository _reportRepository;
    private readonly IPostRepository _postRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public ReportsService(
        IReportRepository reportRepository,
        IPostRepository postRepository,
        INotificationRepository notificationRepository,
        IHubContext<NotificationHub> hubContext,
        UserManager<ApplicationUser> userManager)
    {
        _reportRepository = reportRepository;
        _postRepository = postRepository;
        _notificationRepository = notificationRepository;
        _hubContext = hubContext;
        _userManager = userManager;
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

        var reason = dto.Reason.Trim();
        if (reason.Length == 0)
        {
            throw new ArgumentException("Reason is required.");
        }

        var post = await _postRepository.GetByIdAsync(postId);
        if (post is null)
        {
            throw new InvalidOperationException("Post not found.");
        }

        var reporter = await _userManager.FindByIdAsync(reporterId)
            ?? throw new InvalidOperationException("Reporter not found.");

        var report = new PostReport
        {
            PostId = postId,
            ReporterId = reporterId,
            Reason = reason,
            CreatedAt = DateTime.UtcNow,
        };

        await _reportRepository.AddAsync(report);
        await _reportRepository.SaveChangesAsync();

        await NotifyAdminsAboutReportAsync(postId, reporter.UserName);

        return ToReportResponse(report);
    }

    private async Task NotifyAdminsAboutReportAsync(int postId, string? reporterUserName)
    {
        var adminIds = (await _userManager.GetUsersInRoleAsync(AppRoles.Admin))
            .Select(admin => admin.Id)
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Distinct(StringComparer.Ordinal)
            .ToList();

        if (adminIds.Count == 0)
        {
            return;
        }

        var reporterDisplayName = string.IsNullOrWhiteSpace(reporterUserName)
            ? "Một người dùng"
            : reporterUserName;
        var notificationContent = TruncateToMaxLength(
            $"{reporterDisplayName} đã báo cáo một bài viết và cần kiểm duyệt.",
            255);

        foreach (var adminId in adminIds)
        {
            var notification = new Notification
            {
                UserId = adminId,
                Type = "Report",
                Content = notificationContent,
                RelatedEntityId = postId,
                CreatedAt = DateTime.UtcNow,
            };

            await _notificationRepository.AddAsync(notification);
        }

        await _notificationRepository.SaveChangesAsync();

        foreach (var adminId in adminIds)
        {
            await _hubContext.Clients.User(adminId).SendAsync("ReceiveNotification");
        }
    }

    private static string TruncateToMaxLength(string value, int maxLength)
    {
        if (value.Length <= maxLength)
        {
            return value;
        }

        return value[..maxLength];
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