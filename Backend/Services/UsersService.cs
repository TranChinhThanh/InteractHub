namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Users;
using InteractHub.Api.Models;
using InteractHub.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
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

    public async Task<IEnumerable<UserProfileResponseDto>> SearchUsersAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Enumerable.Empty<UserProfileResponseDto>();
        }

        var normalizedQuery = query.Trim();
        var loweredQuery = normalizedQuery.ToLower();

        var users = await _userManager.Users
            .Where(user => (user.UserName ?? string.Empty).ToLower().Contains(loweredQuery))
            .OrderBy(user => user.UserName)
            .Take(10)
            .ToListAsync();

        var results = new List<UserProfileResponseDto>(users.Count);
        foreach (var user in users)
        {
            results.Add(await MapToUserProfileAsync(user));
        }

        return results;
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