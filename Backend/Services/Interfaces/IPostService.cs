namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Posts;

public interface IPostService
{
    Task<PostResponseDto> CreateAsync(string userId, CreatePostDto request);
    Task<PostResponseDto> CreateWithImageAsync(string userId, CreatePostWithImageDto request);
    Task<PostResponseDto?> GetByIdAsync(int postId, string? currentUserId = null);
    Task<PostListResponseDto> GetAllAsync(int pageNumber, int pageSize, string? currentUserId = null);
    Task<PostListResponseDto> GetPostsByUserAsync(string targetUserId, int pageNumber, int pageSize, string? currentUserId = null);
    Task<PostResponseDto?> UpdateAsync(int postId, string userId, UpdatePostDto request);
    Task<bool> DeleteAsync(int postId, string userId, bool isAdmin = false);
}
