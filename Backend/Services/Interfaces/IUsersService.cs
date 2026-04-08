namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Users;

public interface IUsersService
{
    Task<UserProfileResponseDto?> GetUserProfileAsync(string userId);
    Task<UserProfileResponseDto?> UpdateProfileAsync(string userId, UpdateProfileDto dto);
}