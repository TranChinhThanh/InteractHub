namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Friends;
using InteractHub.Api.Hubs;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

public sealed class FriendsService : IFriendsService
{
    private readonly IConnectionRepository _connectionRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public FriendsService(
        IConnectionRepository connectionRepository,
        INotificationRepository notificationRepository,
        IHubContext<NotificationHub> hubContext,
        UserManager<ApplicationUser> userManager)
    {
        _connectionRepository = connectionRepository;
        _notificationRepository = notificationRepository;
        _hubContext = hubContext;
        _userManager = userManager;
    }

    public async Task SendFriendRequestAsync(string followerId, string followeeId)
    {
        if (string.IsNullOrWhiteSpace(followerId) || string.IsNullOrWhiteSpace(followeeId))
        {
            throw new ArgumentException("FollowerId and FolloweeId are required.");
        }

        if (string.Equals(followerId, followeeId, StringComparison.Ordinal))
        {
            throw new ArgumentException("You cannot follow yourself.");
        }

        await EnsureUserExistsAsync(followerId, "Follower user not found.");
        await EnsureUserExistsAsync(followeeId, "Followee user not found.");

        var existingConnection = await _connectionRepository.GetConnectionAsync(followerId, followeeId);
        if (existingConnection is not null)
        {
            throw new InvalidOperationException("Connection already exists.");
        }

        try
        {
            await _connectionRepository.AddAsync(new Connection
            {
                FollowerId = followerId,
                FolloweeId = followeeId,
            });

            await _connectionRepository.SaveChangesAsync();

            var followerUser = await _userManager.FindByIdAsync(followerId);
            var followerUserName = followerUser?.UserName ?? "Ai đó";

            var notification = new Notification
            {
                UserId = followeeId,
                Type = "Follow",
                Content = $"{followerUserName} đã bắt đầu theo dõi bạn.",
                CreatedAt = DateTime.UtcNow,
            };

            await _notificationRepository.AddAsync(notification);

            await _notificationRepository.SaveChangesAsync();
            await _hubContext.Clients.User(notification.UserId).SendAsync("ReceiveNotification");
        }
        catch (DbUpdateException)
        {
            throw new InvalidOperationException("Unable to send friend request.");
        }
    }

    public async Task UnfollowAsync(string followerId, string followeeId)
    {
        if (string.IsNullOrWhiteSpace(followerId) || string.IsNullOrWhiteSpace(followeeId))
        {
            throw new ArgumentException("FollowerId and FolloweeId are required.");
        }

        if (string.Equals(followerId, followeeId, StringComparison.Ordinal))
        {
            throw new ArgumentException("You cannot unfollow yourself.");
        }

        await EnsureUserExistsAsync(followerId, "Follower user not found.");
        await EnsureUserExistsAsync(followeeId, "Followee user not found.");

        var existingConnection = await _connectionRepository.GetConnectionAsync(followerId, followeeId);
        if (existingConnection is null)
        {
            throw new InvalidOperationException("Connection does not exist.");
        }

        try
        {
            _connectionRepository.Delete(existingConnection);
            await _connectionRepository.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new InvalidOperationException("Unable to unfollow user.");
        }
    }

    public async Task<IEnumerable<FriendResponseDto>> GetFollowersAsync(string userId)
    {
        await EnsureUserExistsAsync(userId, "User not found.");

        var connections = await _connectionRepository.GetUserConnectionsAsync(userId);

        return connections
            .Where(c => string.Equals(c.FolloweeId, userId, StringComparison.Ordinal))
            .Select(c => ToFriendResponse(c.Follower, c.FollowerId))
            .ToList();
    }

    public async Task<IEnumerable<FriendResponseDto>> GetFollowingAsync(string userId)
    {
        await EnsureUserExistsAsync(userId, "User not found.");

        var connections = await _connectionRepository.GetUserConnectionsAsync(userId);

        return connections
            .Where(c => string.Equals(c.FollowerId, userId, StringComparison.Ordinal))
            .Select(c => ToFriendResponse(c.Followee, c.FolloweeId))
            .ToList();
    }

    private async Task EnsureUserExistsAsync(string userId, string errorMessage)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user is null)
        {
            throw new InvalidOperationException(errorMessage);
        }
    }

    private static FriendResponseDto ToFriendResponse(ApplicationUser? user, string fallbackUserId)
    {
        return new FriendResponseDto
        {
            UserId = user?.Id ?? fallbackUserId,
            UserName = user?.UserName ?? string.Empty,
            AvatarUrl = user?.ProfilePictureUrl,
            Bio = user?.Bio,
        };
    }
}