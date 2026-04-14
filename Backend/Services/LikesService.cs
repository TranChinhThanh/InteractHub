namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Likes;
using InteractHub.Api.Hubs;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

public sealed class LikesService : ILikesService
{
    private readonly ILikeRepository _likeRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICommentRepository _commentRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public LikesService(
        ILikeRepository likeRepository,
        IPostRepository postRepository,
        ICommentRepository commentRepository,
        INotificationRepository notificationRepository,
        IHubContext<NotificationHub> hubContext,
        UserManager<ApplicationUser> userManager)
    {
        _likeRepository = likeRepository;
        _postRepository = postRepository;
        _commentRepository = commentRepository;
        _notificationRepository = notificationRepository;
        _hubContext = hubContext;
        _userManager = userManager;
    }

    public async Task<ToggleLikeResponseDto> TogglePostLikeAsync(int postId, string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("UserId is required.");
        }

        var post = await _postRepository.GetByIdAsync(postId);
        if (post is null)
        {
            throw new InvalidOperationException("Post not found.");
        }

        var existingLike = await _likeRepository.GetPostLikeAsync(postId, userId);
        if (existingLike is not null)
        {
            _likeRepository.Delete(existingLike);
            await _likeRepository.SaveChangesAsync();

            return new ToggleLikeResponseDto
            {
                IsLiked = false,
            };
        }

        await _likeRepository.AddAsync(new Like
        {
            PostId = postId,
            UserId = userId,
        });

        await _likeRepository.SaveChangesAsync();

        if (!string.Equals(post.UserId, userId, StringComparison.Ordinal))
        {
            var likerUser = await _userManager.FindByIdAsync(userId);
            var likerUserName = likerUser?.UserName;
            var content = string.IsNullOrWhiteSpace(likerUserName)
                ? "Ai đó đã thích bài viết của bạn."
                : $"{likerUserName} đã thích bài viết của bạn.";

            var notification = new Notification
            {
                UserId = post.UserId,
                Type = "Like",
                Content = content,
                RelatedEntityId = postId,
                CreatedAt = DateTime.UtcNow,
            };

            await _notificationRepository.AddAsync(notification);

            await _notificationRepository.SaveChangesAsync();
            await _hubContext.Clients.User(notification.UserId).SendAsync("ReceiveNotification");
        }

        return new ToggleLikeResponseDto
        {
            IsLiked = true,
        };
    }

    public async Task<ToggleLikeResponseDto> ToggleCommentLikeAsync(int commentId, string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("UserId is required.");
        }

        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment is null)
        {
            throw new InvalidOperationException("Comment not found.");
        }

        var existingLike = await _likeRepository.GetCommentLikeAsync(commentId, userId);
        if (existingLike is not null)
        {
            _likeRepository.Delete(existingLike);
            await _likeRepository.SaveChangesAsync();

            return new ToggleLikeResponseDto
            {
                IsLiked = false,
            };
        }

        await _likeRepository.AddAsync(new Like
        {
            CommentId = commentId,
            UserId = userId,
        });

        await _likeRepository.SaveChangesAsync();

        return new ToggleLikeResponseDto
        {
            IsLiked = true,
        };
    }
}