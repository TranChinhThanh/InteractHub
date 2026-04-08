namespace InteractHub.Api.Services;

using InteractHub.Api.DTOs.Auth;
using InteractHub.Api.Models;
using InteractHub.Api.Security;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

public sealed class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;

    public AuthService(UserManager<ApplicationUser> userManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
    }

    public async Task<(bool Succeeded, string Message)> RegisterAsync(RegisterDto request)
    {
        var existingUserByName = await _userManager.FindByNameAsync(request.Username);
        if (existingUserByName is not null)
        {
            return (false, "Username already exists.");
        }

        var existingUserByEmail = await _userManager.FindByEmailAsync(request.Email);
        if (existingUserByEmail is not null)
        {
            return (false, "Email already exists.");
        }

        var user = new ApplicationUser
        {
            UserName = request.Username,
            Email = request.Email,
            FullName = request.FullName,
            SecurityStamp = Guid.NewGuid().ToString(),
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            var firstError = result.Errors.FirstOrDefault()?.Description ?? "User creation failed.";
            return (false, firstError);
        }

        var addRoleResult = await _userManager.AddToRoleAsync(user, AppRoles.User);
        if (!addRoleResult.Succeeded)
        {
            var firstError = addRoleResult.Errors.FirstOrDefault()?.Description ?? "Assign default role failed.";
            return (false, firstError);
        }

        return (true, "User registered successfully.");
    }

    public async Task<AuthResponseDto?> LoginAsync(LoginDto request)
    {
        var user = await _userManager.FindByNameAsync(request.Username);
        if (user is null)
        {
            return null;
        }

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid)
        {
            return null;
        }

        var roles = await _userManager.GetRolesAsync(user);
        return _tokenService.GenerateToken(user, roles);
    }
}
