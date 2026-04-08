namespace InteractHub.Api.DTOs.Common;

public sealed record ApiResponse<T>
{
    public bool Success { get; init; }
    public T? Data { get; init; }
    public IReadOnlyList<string> Errors { get; init; } = Array.Empty<string>();
}

public static class ApiResponse
{
    public static ApiResponse<T> Success<T>(T data)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Errors = Array.Empty<string>(),
        };
    }

    public static ApiResponse<object?> Failure(params string[] errors)
    {
        return Failure((IEnumerable<string>)errors);
    }

    public static ApiResponse<object?> Failure(IEnumerable<string> errors)
    {
        return new ApiResponse<object?>
        {
            Success = false,
            Data = null,
            Errors = errors
                .Where(error => !string.IsNullOrWhiteSpace(error))
                .Select(error => error.Trim())
                .Distinct(StringComparer.Ordinal)
                .ToList(),
        };
    }
}
