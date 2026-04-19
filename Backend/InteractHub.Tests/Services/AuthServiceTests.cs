namespace InteractHub.Tests.Services;

using InteractHub.Api.DTOs.Auth;
using InteractHub.Api.Models;
using InteractHub.Api.Security;
using InteractHub.Api.Services;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Moq;

public sealed class AuthServiceTests
{
    [Fact]
    public async Task RegisterAsync_ShouldReturnSuccess_WhenDataIsValid()
    {
        var userManagerMock = CreateUserManagerMock();
        var tokenServiceMock = new Mock<ITokenService>(MockBehavior.Strict);
        var service = new AuthService(userManagerMock.Object, tokenServiceMock.Object);

        var request = new RegisterDto
        {
            Username = "newuser",
            Email = "newuser@example.com",
            Password = "Password123!",
            FullName = "New User",
        };

        userManagerMock
            .Setup(manager => manager.FindByNameAsync(request.Username))
            .ReturnsAsync((ApplicationUser?)null);

        userManagerMock
            .Setup(manager => manager.FindByEmailAsync(request.Email))
            .ReturnsAsync((ApplicationUser?)null);

        userManagerMock
            .Setup(manager => manager.CreateAsync(
                It.Is<ApplicationUser>(user =>
                    user.UserName == request.Username
                    && user.Email == request.Email
                    && user.FullName == request.FullName
                    && !string.IsNullOrWhiteSpace(user.SecurityStamp)),
                request.Password))
            .ReturnsAsync(IdentityResult.Success);

        userManagerMock
            .Setup(manager => manager.AddToRoleAsync(
                It.Is<ApplicationUser>(user => user.UserName == request.Username),
                AppRoles.User))
            .ReturnsAsync(IdentityResult.Success);

        var result = await service.RegisterAsync(request);

        Assert.True(result.Succeeded);
        Assert.Equal("User registered successfully.", result.Message);

        userManagerMock.Verify(manager => manager.FindByNameAsync(request.Username), Times.Once);
        userManagerMock.Verify(manager => manager.FindByEmailAsync(request.Email), Times.Once);
        userManagerMock.Verify(manager => manager.CreateAsync(It.IsAny<ApplicationUser>(), request.Password), Times.Once);
        userManagerMock.Verify(manager => manager.AddToRoleAsync(It.IsAny<ApplicationUser>(), AppRoles.User), Times.Once);
        tokenServiceMock.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task RegisterAsync_ShouldReturnError_WhenUsernameAlreadyExists()
    {
        var userManagerMock = CreateUserManagerMock();
        var tokenServiceMock = new Mock<ITokenService>(MockBehavior.Strict);
        var service = new AuthService(userManagerMock.Object, tokenServiceMock.Object);

        var request = new RegisterDto
        {
            Username = "existinguser",
            Email = "existing@example.com",
            Password = "Password123!",
            FullName = "Existing User",
        };

        userManagerMock
            .Setup(manager => manager.FindByNameAsync(request.Username))
            .ReturnsAsync(new ApplicationUser { UserName = request.Username, Email = request.Email });

        var result = await service.RegisterAsync(request);

        Assert.False(result.Succeeded);
        Assert.Equal("Username already exists.", result.Message);

        userManagerMock.Verify(manager => manager.FindByNameAsync(request.Username), Times.Once);
        userManagerMock.Verify(manager => manager.FindByEmailAsync(It.IsAny<string>()), Times.Never);
        userManagerMock.Verify(manager => manager.CreateAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()), Times.Never);
        userManagerMock.Verify(manager => manager.AddToRoleAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()), Times.Never);
        tokenServiceMock.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnToken_WhenCredentialsAreValid()
    {
        var userManagerMock = CreateUserManagerMock();
        var tokenServiceMock = new Mock<ITokenService>();
        var service = new AuthService(userManagerMock.Object, tokenServiceMock.Object);

        var request = new LoginDto
        {
            Username = "validuser",
            Password = "Password123!",
        };

        var user = new ApplicationUser
        {
            Id = "user-1",
            UserName = request.Username,
            Email = "validuser@example.com",
        };

        IList<string> roles = new List<string> { AppRoles.User };
        var expectedAuth = new AuthResponseDto
        {
            Token = "mock-jwt-token",
            UserId = user.Id,
            Username = user.UserName ?? string.Empty,
            ExpiresAtUtc = DateTime.UtcNow.AddHours(1),
        };

        userManagerMock
            .Setup(manager => manager.FindByNameAsync(request.Username))
            .ReturnsAsync(user);

        userManagerMock
            .Setup(manager => manager.CheckPasswordAsync(user, request.Password))
            .ReturnsAsync(true);

        userManagerMock
            .Setup(manager => manager.GetRolesAsync(user))
            .ReturnsAsync(roles);

        tokenServiceMock
            .Setup(service => service.GenerateToken(user, roles))
            .Returns(expectedAuth);

        var result = await service.LoginAsync(request);

        Assert.NotNull(result);
        Assert.Equal(expectedAuth.Token, result.Token);
        Assert.Equal(expectedAuth.UserId, result.UserId);
        Assert.Equal(expectedAuth.Username, result.Username);

        userManagerMock.Verify(manager => manager.FindByNameAsync(request.Username), Times.Once);
        userManagerMock.Verify(manager => manager.CheckPasswordAsync(user, request.Password), Times.Once);
        userManagerMock.Verify(manager => manager.GetRolesAsync(user), Times.Once);
        tokenServiceMock.Verify(service => service.GenerateToken(user, roles), Times.Once);
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnError_WhenUserNotFound()
    {
        var userManagerMock = CreateUserManagerMock();
        var tokenServiceMock = new Mock<ITokenService>(MockBehavior.Strict);
        var service = new AuthService(userManagerMock.Object, tokenServiceMock.Object);

        var request = new LoginDto
        {
            Username = "missinguser",
            Password = "Password123!",
        };

        userManagerMock
            .Setup(manager => manager.FindByNameAsync(request.Username))
            .ReturnsAsync((ApplicationUser?)null);

        var result = await service.LoginAsync(request);

        Assert.Null(result);

        userManagerMock.Verify(manager => manager.FindByNameAsync(request.Username), Times.Once);
        userManagerMock.Verify(manager => manager.CheckPasswordAsync(It.IsAny<ApplicationUser>(), It.IsAny<string>()), Times.Never);
        userManagerMock.Verify(manager => manager.GetRolesAsync(It.IsAny<ApplicationUser>()), Times.Never);
        tokenServiceMock.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task LoginAsync_ShouldReturnError_WhenPasswordIsInvalid()
    {
        var userManagerMock = CreateUserManagerMock();
        var tokenServiceMock = new Mock<ITokenService>(MockBehavior.Strict);
        var service = new AuthService(userManagerMock.Object, tokenServiceMock.Object);

        var request = new LoginDto
        {
            Username = "validuser",
            Password = "WrongPassword123!",
        };

        var user = new ApplicationUser
        {
            Id = "user-2",
            UserName = request.Username,
            Email = "validuser@example.com",
        };

        userManagerMock
            .Setup(manager => manager.FindByNameAsync(request.Username))
            .ReturnsAsync(user);

        userManagerMock
            .Setup(manager => manager.CheckPasswordAsync(user, request.Password))
            .ReturnsAsync(false);

        var result = await service.LoginAsync(request);

        Assert.Null(result);

        userManagerMock.Verify(manager => manager.FindByNameAsync(request.Username), Times.Once);
        userManagerMock.Verify(manager => manager.CheckPasswordAsync(user, request.Password), Times.Once);
        userManagerMock.Verify(manager => manager.GetRolesAsync(It.IsAny<ApplicationUser>()), Times.Never);
        tokenServiceMock.VerifyNoOtherCalls();
    }

    private static Mock<UserManager<ApplicationUser>> CreateUserManagerMock()
    {
        var store = new Mock<IUserStore<ApplicationUser>>();

        return new Mock<UserManager<ApplicationUser>>(
            store.Object,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!,
            null!);
    }
}
