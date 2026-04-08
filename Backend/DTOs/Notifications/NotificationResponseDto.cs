namespace InteractHub.Api.DTOs.Notifications;

public sealed record NotificationResponseDto
{
    public int Id { get; init; }
    public string UserId { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public bool IsRead { get; init; }
    public int? RelatedEntityId { get; init; }
    public DateTime CreatedAt { get; init; }
}