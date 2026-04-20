namespace InteractHub.Api.DTOs.Common;

public sealed record SuccessResponseDto
{
    public string Message { get; init; } = string.Empty;
}

public sealed record DeleteCountSuccessResponseDto
{
    public string Message { get; init; } = string.Empty;
    public int DeletedCount { get; init; }
}

public sealed record ProtectedAccessResponseDto
{
    public string Message { get; init; } = string.Empty;
    public string? Username { get; init; }
    public string? UserId { get; init; }
    public string[] Roles { get; init; } = Array.Empty<string>();
}

public sealed record SelfOrAdminAccessResponseDto
{
    public string Message { get; init; } = string.Empty;
    public string RequestedUserId { get; init; } = string.Empty;
    public string? TokenUserId { get; init; }
}
