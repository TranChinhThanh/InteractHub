using InteractHub.Api.DTOs.Auth;
using InteractHub.Api.DTOs.Common;
using InteractHub.Api.Security;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace InteractHub.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Registers a new user account.
        /// </summary>
        /// <remarks>
        /// Sample payload:
        /// {
        ///   "username": "newuser",
        ///   "email": "newuser@example.com",
        ///   "password": "Password123!",
        ///   "fullName": "New User"
        /// }
        /// </remarks>
        /// <param name="request">Registration payload containing identity and credential fields.</param>
        /// <returns>A standardized success or failure API response.</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            var result = await _authService.RegisterAsync(request);
            if (!result.Succeeded)
            {
                return BadRequest(ApiResponse.Failure(result.Message));
            }

            return Ok(ApiResponse.Success(new { message = result.Message }));
        }

        /// <summary>
        /// Authenticates a user and returns a JWT token.
        /// </summary>
        /// <remarks>
        /// Sample payload:
        /// {
        ///   "username": "newuser",
        ///   "password": "Password123!"
        /// }
        /// </remarks>
        /// <param name="request">Login payload with username and password.</param>
        /// <returns>A standardized success response containing JWT data, or an unauthorized error response.</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            var response = await _authService.LoginAsync(request);
            if (response is null)
            {
                return Unauthorized(ApiResponse.Failure("Invalid username or password."));
            }

            return Ok(ApiResponse.Success(response));
        }

        [Authorize]
        [HttpGet("/api/test/protected")]
        public IActionResult Protected()
        {
            return Ok(ApiResponse.Success(new
            {
                message = "Authorized access success.",
                username = User.Identity?.Name,
                userId = User.FindFirstValue(ClaimTypes.NameIdentifier),
                roles = User.FindAll(ClaimTypes.Role).Select(claim => claim.Value).ToArray(),
            }));
        }

        [Authorize(Roles = AppRoles.User)]
        [HttpGet("/api/test/user-role")]
        public IActionResult UserRoleOnly()
        {
            return Ok(ApiResponse.Success(new { message = "User role access success." }));
        }

        [Authorize(Policy = AppPolicies.SelfOrAdmin)]
        [HttpGet("/api/test/self/{userId}")]
        public IActionResult SelfOrAdmin(string userId)
        {
            return Ok(ApiResponse.Success(new
            {
                message = "Self/Admin policy access success.",
                requestedUserId = userId,
                tokenUserId = User.FindFirstValue(ClaimTypes.NameIdentifier),
            }));
        }
    }
}