namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Friends;

public interface IFriendsService
{
    Task SendFriendRequestAsync(string followerId, string followeeId);
    Task<IEnumerable<FriendResponseDto>> GetFollowersAsync(string userId);
    Task<IEnumerable<FriendResponseDto>> GetFollowingAsync(string userId);
}