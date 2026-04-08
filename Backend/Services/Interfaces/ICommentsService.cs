namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Comments;

public interface ICommentsService
{
    Task<CommentResponseDto> CreateCommentAsync(int postId, string userId, CreateCommentDto dto);
    Task<IEnumerable<CommentResponseDto>> GetCommentsByPostIdAsync(int postId);
    Task DeleteCommentAsync(int commentId, string userId);
}