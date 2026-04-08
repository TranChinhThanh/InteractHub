namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Likes;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Services.Interfaces;

public sealed class LikesService : ILikesService
{
    private readonly ILikeRepository _likeRepository;
    private readonly IPostRepository _postRepository;
    private readonly ICommentRepository _commentRepository;

    public LikesService(
        ILikeRepository likeRepository,
        IPostRepository postRepository,
        ICommentRepository commentRepository)
    {
        _likeRepository = likeRepository;
        _postRepository = postRepository;
        _commentRepository = commentRepository;
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