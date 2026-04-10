namespace InteractHub.Api.Repositories;

using InteractHub.Api.Data;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

public sealed class ReportRepository : GenericRepository<PostReport>, IReportRepository
{
    private readonly ApplicationDbContext _context;

    public ReportRepository(ApplicationDbContext context)
        : base(context)
    {
        _context = context;
    }

    public async Task DeleteByPostIdAsync(int postId)
    {
        var reports = await _context.PostReports
            .Where(report => report.PostId == postId)
            .ToListAsync();

        if (reports.Count == 0)
        {
            return;
        }

        _context.PostReports.RemoveRange(reports);
    }
}