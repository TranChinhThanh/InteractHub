namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Auth;

public interface IAuthService
{
    Task<(bool Succeeded, string Message)> RegisterAsync(RegisterDto request);
    Task<AuthResponseDto?> LoginAsync(LoginDto request);
}
