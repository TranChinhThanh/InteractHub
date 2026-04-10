namespace InteractHub.Api.Controllers;

using System.Security.Claims;
using InteractHub.Api.DTOs.Common;
using InteractHub.Api.DTOs.Friends;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/friends")]
[Authorize]
public class FriendsController : ControllerBase
{
    private readonly IFriendsService _friendsService;

    public FriendsController(IFriendsService friendsService)
    {
        _friendsService = friendsService;
    }

    [HttpPost("{followeeId}")]
    public async Task<IActionResult> SendFriendRequest(string followeeId)
    {
        var followerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(followerId))
        {
            return Unauthorized(ApiResponse.Failure("Invalid token."));
        }

        try
        {
            await _friendsService.SendFriendRequestAsync(followerId, followeeId);
            return Ok(ApiResponse.Success(new { message = "Friend request sent successfully." }));
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
            return BadRequest(ApiResponse.Failure("Unable to process friend request."));
        }
    }

    [HttpDelete("{followeeId}")]
    public async Task<IActionResult> Unfollow(string followeeId)
    {
        var followerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(followerId))
        {
            return Unauthorized(ApiResponse.Failure("Invalid token."));
        }

        try
        {
            await _friendsService.UnfollowAsync(followerId, followeeId);
            return Ok(ApiResponse.Success(new { message = "Unfollowed successfully." }));
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
            return BadRequest(ApiResponse.Failure("Unable to process unfollow request."));
        }
    }

    [HttpGet("{userId}/followers")]
    public async Task<ActionResult<IEnumerable<FriendResponseDto>>> GetFollowers(string userId)
    {
        try
        {
            var followers = await _friendsService.GetFollowersAsync(userId);
            return Ok(ApiResponse.Success(followers));
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
            return BadRequest(ApiResponse.Failure("Unable to get followers list."));
        }
    }

    [HttpGet("{userId}/following")]
    public async Task<ActionResult<IEnumerable<FriendResponseDto>>> GetFollowing(string userId)
    {
        try
        {
            var following = await _friendsService.GetFollowingAsync(userId);
            return Ok(ApiResponse.Success(following));
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
            return BadRequest(ApiResponse.Failure("Unable to get following list."));
        }
    }
}