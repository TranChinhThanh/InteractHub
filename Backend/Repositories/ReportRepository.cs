namespace InteractHub.Api.Repositories;

using InteractHub.Api.Data;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;

public sealed class ReportRepository : GenericRepository<PostReport>, IReportRepository
{
    public ReportRepository(ApplicationDbContext context)
        : base(context)
    {
    }
}