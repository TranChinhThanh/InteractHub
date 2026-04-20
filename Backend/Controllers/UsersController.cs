namespace InteractHub.Api.Controllers;

using InteractHub.Api.DTOs.Common;
using InteractHub.Api.DTOs.Users;
using InteractHub.Api.Security;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUsersService _usersService;

    public UsersController(IUsersService usersService)
    {
        _usersService = usersService;
    }

    /// <summary>
    /// Searches users by query string.
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        var users = await _usersService.SearchUsersAsync(q);
        return Ok(ApiResponse.Success(users));
    }

    /// <summary>
    /// Gets a user profile by identifier.
    /// </summary>
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetById(string userId)
    {
        var profile = await _usersService.GetUserProfileAsync(userId);
        if (profile is null)
        {
            return NotFound(ApiResponse.Failure("User not found"));
        }

        return Ok(ApiResponse.Success(profile));
    }

    /// <summary>
    /// Updates profile information for a user.
    /// </summary>
    [HttpPut("{userId}")]
    [Authorize(Policy = AppPolicies.SelfOrAdmin)]
    public async Task<IActionResult> UpdateProfile(string userId, [FromBody] UpdateProfileDto dto)
    {
        try
        {
            var profile = await _usersService.UpdateProfileAsync(userId, dto);
            if (profile is null)
            {
                return NotFound(ApiResponse.Failure("User not found"));
            }

            return Ok(ApiResponse.Success(profile));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse.Failure(ex.Message));
        }
    }
}