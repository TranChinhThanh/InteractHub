namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Likes;

public interface ILikesService
{
    Task<ToggleLikeResponseDto> TogglePostLikeAsync(int postId, string userId);
    Task<ToggleLikeResponseDto> ToggleCommentLikeAsync(int commentId, string userId);
}