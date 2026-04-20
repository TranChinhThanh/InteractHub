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

    /// <summary>
    /// Gets paginated posts for the feed.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PostListResponseDto>> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var result = await _postService.GetAllAsync(pageNumber, pageSize, currentUserId);
        return Ok(ApiResponse.Success(result));
    }

    /// <summary>
    /// Gets paginated posts created by a specific user.
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<PostListResponseDto>> GetByUserId(string userId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var result = await _postService.GetPostsByUserAsync(userId, pageNumber, pageSize, currentUserId);
            return Ok(ApiResponse.Success(result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse.Failure(ex.Message));
        }
    }

    /// <summary>
    /// Gets a post by identifier.
    /// </summary>
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

    /// <summary>
    /// Creates a new text post for the current user.
    /// </summary>
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

    /// <summary>
    /// Creates a new post with image upload for the current user.
    /// </summary>
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

    /// <summary>
    /// Updates a post owned by the current user or accessible by policy.
    /// </summary>
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

    /// <summary>
    /// Deletes a post by identifier when authorized.
    /// </summary>
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

        return Ok(ApiResponse.Success(new SuccessResponseDto
        {
            Message = "Post deleted successfully.",
        }));
    }
}
