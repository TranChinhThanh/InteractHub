namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Comments;
using InteractHub.Api.Hubs;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Security;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

public sealed class CommentsService : ICommentsService
{
    private readonly ICommentRepository _commentRepository;
    private readonly IPostRepository _postRepository;
    private readonly INotificationRepository _notificationRepository;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly UserManager<ApplicationUser> _userManager;

    public CommentsService(
        ICommentRepository commentRepository,
        IPostRepository postRepository,
        INotificationRepository notificationRepository,
        IHubContext<NotificationHub> hubContext,
        UserManager<ApplicationUser> userManager)
    {
        _commentRepository = commentRepository;
        _postRepository = postRepository;
        _notificationRepository = notificationRepository;
        _hubContext = hubContext;
        _userManager = userManager;
    }

    public async Task<CommentResponseDto> CreateCommentAsync(int postId, string userId, CreateCommentDto dto)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("UserId is required.");
        }

        if (dto is null)
        {
            throw new ArgumentException("Comment payload is required.");
        }

        var post = await _postRepository.GetByIdAsync(postId);
        if (post is null)
        {
            throw new InvalidOperationException("Post not found.");
        }

        var user = await _userManager.FindByIdAsync(userId)
            ?? throw new InvalidOperationException("User not found.");

        var now = DateTime.UtcNow;
        var comment = new Comment
        {
            PostId = postId,
            UserId = userId,
            Content = dto.Content.Trim(),
            CreatedAt = now,
        };

        try
        {
            await _commentRepository.AddAsync(comment);
            await _commentRepository.SaveChangesAsync();

            if (!string.Equals(post.UserId, userId, StringComparison.Ordinal))
            {
                var notification = new Notification
                {
                    UserId = post.UserId,
                    Type = "Comment",
                    Content = $"{user.UserName} đã bình luận về bài viết của bạn.",
                    RelatedEntityId = postId,
                    CreatedAt = DateTime.UtcNow,
                };

                await _notificationRepository.AddAsync(notification);

                await _notificationRepository.SaveChangesAsync();
                await _hubContext.Clients.User(notification.UserId).SendAsync("ReceiveNotification");
            }
        }
        catch (DbUpdateException)
        {
            throw new InvalidOperationException("Unable to create comment.");
        }

        return ToCommentResponse(comment, user);
    }

    public async Task<IEnumerable<CommentResponseDto>> GetCommentsByPostIdAsync(int postId)
    {
        var comments = await _commentRepository.GetCommentsByPostIdAsync(postId);

        return comments
            .Select(comment => ToCommentResponse(comment, comment.User))
            .ToList();
    }

    public async Task DeleteCommentAsync(int commentId, string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            throw new ArgumentException("UserId is required.");
        }

        var actor = await _userManager.FindByIdAsync(userId)
            ?? throw new InvalidOperationException("User not found.");

        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment is null)
        {
            throw new InvalidOperationException("Comment not found.");
        }

        var isAdmin = await _userManager.IsInRoleAsync(actor, AppRoles.Admin);
        var isOwner = string.Equals(comment.UserId, userId, StringComparison.Ordinal);

        if (!isAdmin && !isOwner)
        {
            throw new UnauthorizedAccessException("You do not have permission to delete this comment.");
        }

        try
        {
            _commentRepository.Delete(comment);
            await _commentRepository.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new InvalidOperationException("Unable to delete comment.");
        }
    }

    private static CommentResponseDto ToCommentResponse(Comment comment, ApplicationUser? user)
    {
        return new CommentResponseDto
        {
            Id = comment.Id,
            PostId = comment.PostId,
            UserId = comment.UserId,
            UserName = user?.UserName ?? string.Empty,
            UserAvatarUrl = user?.ProfilePictureUrl,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
        };
    }
}