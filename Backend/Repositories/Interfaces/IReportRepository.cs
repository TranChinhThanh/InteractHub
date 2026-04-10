namespace InteractHub.Api.Repositories.Interfaces;

using InteractHub.Api.Models;

public interface IReportRepository : IGenericRepository<PostReport>
{
	Task DeleteByPostIdAsync(int postId);
}