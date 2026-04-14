namespace InteractHub.Api.Services;

using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

public sealed class AzureBlobService : IFileService
{
    private readonly IConfiguration _configuration;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<AzureBlobService> _logger;
    private readonly string? _connectionString;
    private BlobServiceClient? _blobServiceClient;

    public AzureBlobService(
        IConfiguration configuration,
        IWebHostEnvironment environment,
        ILogger<AzureBlobService> logger)
    {
        _configuration = configuration;
        _environment = environment;
        _logger = logger;
        _connectionString = configuration.GetConnectionString("AzureBlobStorage");
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

        if (!HasBlobConfiguration())
        {
            _logger.LogWarning(
                "Connection string 'AzureBlobStorage' is missing. Falling back to local file storage for container '{ContainerName}'.",
                containerName);
            return await UploadToLocalAsync(file, containerName);
        }

        return await UploadToBlobAsync(file, containerName);
    }

    public async Task<bool> DeleteFileAsync(string fileUrl, string containerName)
    {
        if (string.IsNullOrWhiteSpace(fileUrl))
        {
            throw new ArgumentException("File URL is required.", nameof(fileUrl));
        }

        if (!HasBlobConfiguration())
        {
            return DeleteFromLocal(fileUrl, containerName);
        }

        return await DeleteFromBlobAsync(fileUrl, containerName);
    }

    private async Task<string> UploadToBlobAsync(IFormFile file, string containerName)
    {
        var blobServiceClient = GetBlobServiceClient();
        var normalizedContainerName = NormalizeContainerName(containerName);
        var containerClient = blobServiceClient.GetBlobContainerClient(normalizedContainerName);

        try
        {
            await containerClient.CreateIfNotExistsAsync(PublicAccessType.Blob);

            var extension = Path.GetExtension(file.FileName);
            var blobName = $"{Guid.NewGuid():N}{extension}";
            var blobClient = containerClient.GetBlobClient(blobName);

            await using var stream = file.OpenReadStream();
            await blobClient.UploadAsync(
                stream,
                new BlobUploadOptions
                {
                    HttpHeaders = new BlobHttpHeaders
                    {
                        ContentType = string.IsNullOrWhiteSpace(file.ContentType)
                            ? "application/octet-stream"
                            : file.ContentType,
                    },
                });

            return blobClient.Uri.AbsoluteUri;
        }
        catch (RequestFailedException ex)
        {
            throw new InvalidOperationException(
                $"Unable to upload file to Azure Blob Storage container '{normalizedContainerName}'.",
                ex);
        }
    }

    private async Task<bool> DeleteFromBlobAsync(string fileUrl, string containerName)
    {
        var normalizedContainerName = NormalizeContainerName(containerName);
        var blobName = ExtractBlobName(fileUrl, normalizedContainerName);
        if (string.IsNullOrWhiteSpace(blobName))
        {
            return false;
        }

        var blobServiceClient = GetBlobServiceClient();
        var containerClient = blobServiceClient.GetBlobContainerClient(normalizedContainerName);
        var blobClient = containerClient.GetBlobClient(blobName);

        try
        {
            var result = await blobClient.DeleteIfExistsAsync(DeleteSnapshotsOption.IncludeSnapshots);
            return result.Value;
        }
        catch (RequestFailedException ex)
        {
            throw new InvalidOperationException(
                $"Unable to delete blob '{blobName}' from container '{normalizedContainerName}'.",
                ex);
        }
    }

    private async Task<string> UploadToLocalAsync(IFormFile file, string containerName)
    {
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

        var baseUrl = GetPublicBaseUrl();
        return $"{baseUrl}/uploads/{normalizedContainerName}/{fileName}";
    }

    private bool DeleteFromLocal(string fileUrl, string containerName)
    {
        var normalizedContainerName = NormalizeContainerName(containerName);
        var relativePath = ExtractRelativePath(fileUrl);
        var expectedPrefix = $"uploads/{normalizedContainerName}/";

        if (!relativePath.StartsWith(expectedPrefix, StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        var fileName = relativePath[expectedPrefix.Length..];
        if (string.IsNullOrWhiteSpace(fileName)
            || fileName.Contains("..", StringComparison.Ordinal)
            || !string.Equals(Path.GetFileName(fileName), fileName, StringComparison.Ordinal))
        {
            return false;
        }

        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var fullPath = Path.Combine(webRoot, "uploads", normalizedContainerName, fileName);
        if (!File.Exists(fullPath))
        {
            return false;
        }

        File.Delete(fullPath);
        return true;
    }

    private static string ExtractRelativePath(string fileUrl)
    {
        if (Uri.TryCreate(fileUrl, UriKind.Absolute, out var absoluteUri))
        {
            return absoluteUri.AbsolutePath.TrimStart('/');
        }

        return fileUrl.TrimStart('/');
    }

    private string GetPublicBaseUrl()
    {
        var configuredPublicBaseUrl = _configuration["App:PublicBaseUrl"];
        if (!string.IsNullOrWhiteSpace(configuredPublicBaseUrl))
        {
            return configuredPublicBaseUrl.TrimEnd('/');
        }

        var aspNetCoreUrls = _configuration["ASPNETCORE_URLS"];
        if (!string.IsNullOrWhiteSpace(aspNetCoreUrls))
        {
            var urls = aspNetCoreUrls.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            if (urls.Length > 0)
            {
                return urls[0].TrimEnd('/');
            }
        }

        return "http://localhost:5035";
    }

    private bool HasBlobConfiguration()
    {
        return !string.IsNullOrWhiteSpace(_connectionString);
    }

    private static string NormalizeContainerName(string containerName)
    {
        if (string.IsNullOrWhiteSpace(containerName))
        {
            throw new ArgumentException("Container name is required.", nameof(containerName));
        }

        return containerName.Trim().ToLowerInvariant();
    }

    private static string ExtractBlobName(string fileUrl, string containerName)
    {
        if (!Uri.TryCreate(fileUrl, UriKind.Absolute, out var uri))
        {
            throw new ArgumentException("File URL must be a valid absolute URI.", nameof(fileUrl));
        }

        var absolutePath = uri.AbsolutePath.TrimStart('/');
        var containerPrefix = $"{containerName}/";

        if (!absolutePath.StartsWith(containerPrefix, StringComparison.OrdinalIgnoreCase))
        {
            return string.Empty;
        }

        return absolutePath[containerPrefix.Length..];
    }

    private BlobServiceClient GetBlobServiceClient()
    {
        if (string.IsNullOrWhiteSpace(_connectionString))
        {
            throw new InvalidOperationException(
                "Connection string 'AzureBlobStorage' not found. Configure it before using file upload/delete operations.");
        }

        _blobServiceClient ??= new BlobServiceClient(_connectionString);
        return _blobServiceClient;
    }
}
