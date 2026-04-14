namespace InteractHub.Api.Services.Interfaces;

public interface IFileService
{
    Task<string> UploadFileAsync(IFormFile file, string containerName);
    Task<bool> DeleteFileAsync(string fileUrl, string containerName);
}
