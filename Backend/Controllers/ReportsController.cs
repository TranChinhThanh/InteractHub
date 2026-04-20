namespace InteractHub.Api.Controllers;

using System.Security.Claims;
using InteractHub.Api.DTOs.Common;
using InteractHub.Api.DTOs.Reports;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/reports")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly IReportsService _reportsService;

    public ReportsController(IReportsService reportsService)
    {
        _reportsService = reportsService;
    }

    /// <summary>
    /// Creates a report for the specified post.
    /// </summary>
    [HttpPost("post/{postId:int}")]
    public async Task<IActionResult> CreatePostReport(int postId, [FromBody] CreateReportDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(ApiResponse.Failure("Invalid token."));
            }

            var result = await _reportsService.CreateReportAsync(postId, userId, dto);
            return StatusCode(StatusCodes.Status201Created, ApiResponse.Success(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse.Failure(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse.Failure(ex.Message));
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse.Failure("An error occurred while processing the request."));
        }
    }
}