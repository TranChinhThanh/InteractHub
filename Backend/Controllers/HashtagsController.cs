namespace InteractHub.Api.Controllers;

using InteractHub.Api.DTOs.Common;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/hashtags")]
public class HashtagsController : ControllerBase
{
    private readonly IHashtagsService _hashtagsService;

    public HashtagsController(IHashtagsService hashtagsService)
    {
        _hashtagsService = hashtagsService;
    }

    /// <summary>
    /// Gets trending hashtags ordered by usage frequency.
    /// </summary>
    [HttpGet("trending")]
    public async Task<IActionResult> GetTrending([FromQuery] int limit = 5)
    {
        try
        {
            var result = await _hashtagsService.GetTrendingHashtagsAsync(limit);
            return Ok(ApiResponse.Success(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse.Failure(ex.Message));
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, ApiResponse.Failure("An error occurred while processing the request."));
        }
    }
}
