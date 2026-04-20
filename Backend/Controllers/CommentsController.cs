namespace InteractHub.Api.Controllers;

using System.Security.Claims;
using InteractHub.Api.DTOs.Comments;
using InteractHub.Api.DTOs.Common;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/comments")]
[Authorize]
public class CommentsController : ControllerBase
{
    private readonly ICommentsService _commentsService;

    public CommentsController(ICommentsService commentsService)
    {
        _commentsService = commentsService;
    }

    /// <summary>
    /// Creates a new comment for the specified post.
    /// </summary>
    [HttpPost("post/{postId:int}")]
    public async Task<IActionResult> Create(int postId, [FromBody] CreateCommentDto dto)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(ApiResponse.Failure("Invalid token."));
            }

            var comment = await _commentsService.CreateCommentAsync(postId, userId, dto);
            return StatusCode(StatusCodes.Status201Created, ApiResponse.Success(comment));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ApiResponse.Failure(ex.Message));
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
    /// Gets all comments for the specified post.
    /// </summary>
    [HttpGet("post/{postId:int}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetByPostId(int postId)
    {
        try
        {
            var comments = await _commentsService.GetCommentsByPostIdAsync(postId);
            return Ok(ApiResponse.Success(comments));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ApiResponse.Failure(ex.Message));
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
    /// Deletes a comment by identifier when authorized.
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

            await _commentsService.DeleteCommentAsync(id, userId);
            return Ok(ApiResponse.Success(new SuccessResponseDto
            {
                Message = "Comment deleted successfully.",
            }));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ApiResponse.Failure(ex.Message));
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