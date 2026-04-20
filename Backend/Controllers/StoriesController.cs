namespace InteractHub.Api.Controllers;

using System.Security.Claims;
using InteractHub.Api.DTOs.Common;
using InteractHub.Api.DTOs.Stories;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/stories")]
[Authorize]
public class StoriesController : ControllerBase
{
    private readonly IStoriesService _storiesService;

    public StoriesController(IStoriesService storiesService)
    {
        _storiesService = storiesService;
    }

    /// <summary>
    /// Creates a story for the current user.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStoryDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(ApiResponse.Failure("Invalid token."));
            }

            var story = await _storiesService.CreateStoryAsync(userId, dto);
            return StatusCode(StatusCodes.Status201Created, ApiResponse.Success(story));
        }
        catch (UnauthorizedAccessException)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ApiResponse.Failure("You do not have permission..."));
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

    /// <summary>
    /// Gets active stories that have not expired.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetActiveStories()
    {
        try
        {
            var stories = await _storiesService.GetActiveStoriesAsync();
            return Ok(ApiResponse.Success(stories));
        }
        catch (UnauthorizedAccessException)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ApiResponse.Failure("You do not have permission..."));
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

    /// <summary>
    /// Deletes a story by identifier when authorized.
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(ApiResponse.Failure("Invalid token."));
            }

            await _storiesService.DeleteStoryAsync(id, userId);
            return Ok(ApiResponse.Success(new SuccessResponseDto
            {
                Message = "Story deleted successfully.",
            }));
        }
        catch (UnauthorizedAccessException)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ApiResponse.Failure("You do not have permission..."));
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