namespace InteractHub.Api.Services;

using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;

public sealed class LocalFileService : IFileService
{
    private readonly IWebHostEnvironment _environment;

    public LocalFileService(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public async Task<string> UploadFileAsync(IFormFile file, string containerName)
    {
        if (file is null)
        {
            throw new ArgumentNullException(nameof(file));
        }

        if (file.Length <= 0)
        {
            throw new ArgumentException("File must not be empty.", nameof(file));
        }

        var normalizedContainerName = NormalizeContainerName(containerName);

        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var uploadsDirectory = Path.Combine(webRoot, "uploads", normalizedContainerName);
        Directory.CreateDirectory(uploadsDirectory);

        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(uploadsDirectory, fileName);

        await using var stream = new FileStream(fullPath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/uploads/{normalizedContainerName}/{fileName}";
    }

    public Task<bool> DeleteFileAsync(string fileUrl, string containerName)
    {
        if (string.IsNullOrWhiteSpace(fileUrl))
        {
            throw new ArgumentException("File URL is required.", nameof(fileUrl));
        }

        var normalizedContainerName = NormalizeContainerName(containerName);
        var relativePath = ExtractRelativePath(fileUrl);
        var expectedPrefix = $"uploads/{normalizedContainerName}/";

        if (!relativePath.StartsWith(expectedPrefix, StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(false);
        }

        var fileName = relativePath[expectedPrefix.Length..];
        if (string.IsNullOrWhiteSpace(fileName)
            || fileName.Contains("..", StringComparison.Ordinal)
            || !string.Equals(Path.GetFileName(fileName), fileName, StringComparison.Ordinal))
        {
            return Task.FromResult(false);
        }

        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var fullPath = Path.Combine(webRoot, "uploads", normalizedContainerName, fileName);
        if (!File.Exists(fullPath))
        {
            return Task.FromResult(false);
        }

        File.Delete(fullPath);
        return Task.FromResult(true);
    }

    private static string NormalizeContainerName(string containerName)
    {
        if (string.IsNullOrWhiteSpace(containerName))
        {
            throw new ArgumentException("Container name is required.", nameof(containerName));
        }

        return containerName.Trim().ToLowerInvariant();
    }

    private static string ExtractRelativePath(string fileUrl)
    {
        if (Uri.TryCreate(fileUrl, UriKind.Absolute, out var absoluteUri))
        {
            return absoluteUri.AbsolutePath.TrimStart('/');
        }

        return fileUrl.TrimStart('/');
    }
}
