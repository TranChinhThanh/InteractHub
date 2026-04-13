namespace InteractHub.Api.Controllers;

using System.Security.Claims;
using InteractHub.Api.DTOs.Common;
using InteractHub.Api.DTOs.Posts;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/posts")]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }

    [HttpGet]
    public async Task<ActionResult<PostListResponseDto>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var result = await _postService.GetAllAsync(pageNumber, pageSize, currentUserId);
        return Ok(ApiResponse.Success(result));
    }

    [HttpGet("{postId:int}")]
    public async Task<ActionResult<PostResponseDto>> GetById(int postId)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var result = await _postService.GetByIdAsync(postId, currentUserId);
        if (result is null)
        {
            return NotFound(ApiResponse.Failure("Post not found."));
        }

        return Ok(ApiResponse.Success(result));
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PostResponseDto>> Create([FromBody] CreatePostDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ApiResponse.Failure("Invalid token."));
        }

        try
        {
            var result = await _postService.CreateAsync(userId, request);
            return CreatedAtAction(nameof(GetById), new { postId = result.Id }, ApiResponse.Success(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse.Failure(ex.Message));
        }
        catch (InvalidOperationException)
        {
            return BadRequest(ApiResponse.Failure("Unable to create post for current user."));
        }
    }

    [Authorize]
    [HttpPost("with-image")]
    [Consumes("multipart/form-data")]
    public async Task<ActionResult<PostResponseDto>> CreateWithImage([FromForm] CreatePostWithImageDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ApiResponse.Failure("Invalid token."));
        }

        try
        {
            var result = await _postService.CreateWithImageAsync(userId, request);
            return CreatedAtAction(nameof(GetById), new { postId = result.Id }, ApiResponse.Success(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse.Failure(ex.Message));
        }
        catch (InvalidOperationException)
        {
            return BadRequest(ApiResponse.Failure("Unable to create post for current user."));
        }
    }

    [Authorize]
    [HttpPut("{postId:int}")]
    public async Task<ActionResult<PostResponseDto>> Update(int postId, [FromBody] UpdatePostDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ApiResponse.Failure("Invalid token."));
        }

        try
        {
            var result = await _postService.UpdateAsync(postId, userId, request);
            if (result is null)
            {
                return NotFound(ApiResponse.Failure("Post not found or you do not have permission."));
            }

            return Ok(ApiResponse.Success(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse.Failure(ex.Message));
        }
    }

    [Authorize]
    [HttpDelete("{postId:int}")]
    public async Task<IActionResult> Delete(int postId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(ApiResponse.Failure("Invalid token."));
        }

        var deleted = await _postService.DeleteAsync(postId, userId);
        if (!deleted)
        {
            return NotFound(ApiResponse.Failure("Post not found or you do not have permission."));
        }

        return Ok(ApiResponse.Success(new { message = "Post deleted successfully." }));
    }
}
