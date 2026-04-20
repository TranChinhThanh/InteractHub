namespace InteractHub.Api.Controllers;

using System.Security.Claims;
using InteractHub.Api.DTOs.Common;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationsService _notificationsService;

    public NotificationsController(INotificationsService notificationsService)
    {
        _notificationsService = notificationsService;
    }

    /// <summary>
    /// Gets notifications for the currently authenticated user.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetMyNotifications()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(ApiResponse.Failure("Invalid token."));
            }

            var notifications = await _notificationsService.GetUserNotificationsAsync(userId);
            return Ok(ApiResponse.Success(notifications));
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
    /// Marks a notification as read for the current user.
    /// </summary>
    [HttpPut("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(ApiResponse.Failure("Invalid token."));
            }

            await _notificationsService.MarkAsReadAsync(id, userId);
            return Ok(ApiResponse.Success(new SuccessResponseDto
            {
                Message = "Notification marked as read successfully.",
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

    /// <summary>
    /// Deletes a notification for the current user.
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

            await _notificationsService.DeleteAsync(id, userId);
            return Ok(ApiResponse.Success(new SuccessResponseDto
            {
                Message = "Notification deleted successfully.",
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

    /// <summary>
    /// Deletes all notifications for the current user.
    /// </summary>
    [HttpDelete]
    public async Task<IActionResult> DeleteAll()
    {
        try
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrWhiteSpace(userId))
            {
                return Unauthorized(ApiResponse.Failure("Invalid token."));
            }

            var deletedCount = await _notificationsService.DeleteAllAsync(userId);
            return Ok(ApiResponse.Success(new DeleteCountSuccessResponseDto
            {
                Message = "All notifications deleted successfully.",
                DeletedCount = deletedCount,
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