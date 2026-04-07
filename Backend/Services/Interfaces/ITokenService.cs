namespace InteractHub.Api.Services.Interfaces;

using InteractHub.Api.DTOs.Auth;
using InteractHub.Api.Models;

public interface ITokenService
{
    AuthResponseDto GenerateToken(ApplicationUser user, IList<string> roles);
}
