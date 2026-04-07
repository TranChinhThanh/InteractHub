namespace InteractHub.Api.Controllers;

using System.Security.Claims;
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
        var result = await _postService.GetAllAsync(pageNumber, pageSize);
        return Ok(result);
    }

    [HttpGet("{postId:int}")]
    public async Task<ActionResult<PostResponseDto>> GetById(int postId)
    {
        var result = await _postService.GetByIdAsync(postId);
        if (result is null)
        {
            return NotFound(new { message = "Post not found." });
        }

        return Ok(result);
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PostResponseDto>> Create([FromBody] CreatePostDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        try
        {
            var result = await _postService.CreateAsync(userId, request);
            return CreatedAtAction(nameof(GetById), new { postId = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException)
        {
            return BadRequest(new { message = "Unable to create post for current user." });
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
            return Unauthorized(new { message = "Invalid token." });
        }

        try
        {
            var result = await _postService.CreateWithImageAsync(userId, request);
            return CreatedAtAction(nameof(GetById), new { postId = result.Id }, result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException)
        {
            return BadRequest(new { message = "Unable to create post for current user." });
        }
    }

    [Authorize]
    [HttpPut("{postId:int}")]
    public async Task<ActionResult<PostResponseDto>> Update(int postId, [FromBody] UpdatePostDto request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        try
        {
            var result = await _postService.UpdateAsync(postId, userId, request);
            if (result is null)
            {
                return NotFound(new { message = "Post not found or you do not have permission." });
            }

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [Authorize]
    [HttpDelete("{postId:int}")]
    public async Task<IActionResult> Delete(int postId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Unauthorized(new { message = "Invalid token." });
        }

        var deleted = await _postService.DeleteAsync(postId, userId);
        if (!deleted)
        {
            return NotFound(new { message = "Post not found or you do not have permission." });
        }

        return NoContent();
    }
}
