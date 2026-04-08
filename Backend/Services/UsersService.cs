namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Users;
using InteractHub.Api.Models;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

public sealed class UsersService : IUsersService
{
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<UserProfileResponseDto?> GetUserProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return null;
        }

        return await MapToUserProfileAsync(user);
    }

    public async Task<UserProfileResponseDto?> UpdateProfileAsync(string userId, UpdateProfileDto dto)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            return null;
        }

        user.Bio = dto.Bio?.Trim();
        user.ProfilePictureUrl = dto.AvatarUrl?.Trim();

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            var firstError = updateResult.Errors.FirstOrDefault()?.Description ?? "Unable to update user profile.";
            throw new InvalidOperationException(firstError);
        }

        return await MapToUserProfileAsync(user);
    }

    private async Task<UserProfileResponseDto> MapToUserProfileAsync(ApplicationUser user)
    {
        var roles = await _userManager.GetRolesAsync(user);

        return new UserProfileResponseDto
        {
            Id = user.Id,
            UserName = user.UserName ?? string.Empty,
            Email = user.Email ?? string.Empty,
            Bio = user.Bio,
            AvatarUrl = user.ProfilePictureUrl,
            DateJoined = user.CreatedAt,
            Role = roles.FirstOrDefault() ?? "User",
        };
    }
}