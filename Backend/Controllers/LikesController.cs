namespace InteractHub.Api.Controllers;

using System.Security.Claims;
using InteractHub.Api.DTOs.Common;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/likes")]
[Authorize]
public class LikesController : ControllerBase
{
    private readonly ILikesService _likesService;

    public LikesController(ILikesService likesService)
    {
        _likesService = likesService;
    }

    [HttpPost("post/{postId:int}")]
    public async Task<IActionResult> TogglePostLike(int postId)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(ApiResponse.Failure("Invalid token."));
            }

            var result = await _likesService.TogglePostLikeAsync(postId, userId);
            return Ok(ApiResponse.Success(result));
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

    [HttpPost("comment/{commentId:int}")]
    public async Task<IActionResult> ToggleCommentLike(int commentId)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(ApiResponse.Failure("Invalid token."));
            }

            var result = await _likesService.ToggleCommentLikeAsync(commentId, userId);
            return Ok(ApiResponse.Success(result));
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