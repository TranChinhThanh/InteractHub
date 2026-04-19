namespace InteractHub.Tests.Services;

using InteractHub.Api.DTOs.Comments;
using InteractHub.Api.Hubs;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Security;
using InteractHub.Api.Services;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Moq;

public sealed class CommentsServiceTests
{
    [Fact]
    public async Task CreateCommentAsync_ShouldReturnSuccess_WhenPostExists()
    {
        var commentRepositoryMock = new Mock<ICommentRepository>(MockBehavior.Strict);
        var postRepositoryMock = new Mock<IPostRepository>(MockBehavior.Strict);
        var notificationRepositoryMock = new Mock<INotificationRepository>(MockBehavior.Strict);
        var userManagerMock = CreateUserManagerMock();
        var (hubContextMock, _, clientProxyMock) = CreateNotificationHubContextMock();

        var service = new CommentsService(
            commentRepositoryMock.Object,
            postRepositoryMock.Object,
            notificationRepositoryMock.Object,
            hubContextMock.Object,
            userManagerMock.Object);

        const int postId = 15;
        const string userId = "commenter-1";
        const string ownerId = "owner-1";
        var dto = new CreateCommentDto { Content = "   Hello from test   " };
        var post = new Post { Id = postId, UserId = ownerId, Content = "Post content" };
        var user = new ApplicationUser { Id = userId, UserName = "qa-user" };

        postRepositoryMock
            .Setup(repository => repository.GetByIdAsync(postId))
            .ReturnsAsync(post);

        userManagerMock
            .Setup(manager => manager.FindByIdAsync(userId))
            .ReturnsAsync(user);

        commentRepositoryMock
            .Setup(repository => repository.AddAsync(It.Is<Comment>(comment =>
                comment.PostId == postId
                && comment.UserId == userId
                && comment.Content == "Hello from test")))
            .Callback<Comment>(comment => comment.Id = 99)
            .Returns(Task.CompletedTask);

        commentRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .ReturnsAsync(1);

        notificationRepositoryMock
            .Setup(repository => repository.AddAsync(It.Is<Notification>(notification =>
                notification.UserId == ownerId
                && notification.Type == "Comment"
                && notification.RelatedEntityId == postId
                && notification.Content.Contains(user.UserName!, StringComparison.Ordinal))))
            .Returns(Task.CompletedTask);

        notificationRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .ReturnsAsync(1);

        var result = await service.CreateCommentAsync(postId, userId, dto);

        Assert.Equal(99, result.Id);
        Assert.Equal(postId, result.PostId);
        Assert.Equal(userId, result.UserId);
        Assert.Equal(user.UserName, result.UserName);
        Assert.Equal("Hello from test", result.Content);

        commentRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Comment>()), Times.Once);
        commentRepositoryMock.Verify(repository => repository.SaveChangesAsync(), Times.Once);
        notificationRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Notification>()), Times.Once);
        notificationRepositoryMock.Verify(repository => repository.SaveChangesAsync(), Times.Once);
        clientProxyMock.Verify(proxy => proxy.SendCoreAsync(
            "ReceiveNotification",
            It.Is<object?[]>(arguments => arguments.Length == 0),
            It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task CreateCommentAsync_ShouldThrowInvalidOperation_WhenPostDoesNotExist()
    {
        var commentRepositoryMock = new Mock<ICommentRepository>(MockBehavior.Strict);
        var postRepositoryMock = new Mock<IPostRepository>(MockBehavior.Strict);
        var notificationRepositoryMock = new Mock<INotificationRepository>(MockBehavior.Strict);
        var userManagerMock = CreateUserManagerMock();
        var (hubContextMock, _, _) = CreateNotificationHubContextMock();

        var service = new CommentsService(
            commentRepositoryMock.Object,
            postRepositoryMock.Object,
            notificationRepositoryMock.Object,
            hubContextMock.Object,
            userManagerMock.Object);

        const int postId = 404;
        const string userId = "commenter-1";

        postRepositoryMock
            .Setup(repository => repository.GetByIdAsync(postId))
            .ReturnsAsync((Post?)null);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.CreateCommentAsync(postId, userId, new CreateCommentDto { Content = "hi" }));

        Assert.Equal("Post not found.", exception.Message);

        commentRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Comment>()), Times.Never);
        notificationRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Notification>()), Times.Never);
        userManagerMock.Verify(manager => manager.FindByIdAsync(It.IsAny<string>()), Times.Never);
    }

    [Fact]
    public async Task DeleteCommentAsync_ShouldDelete_WhenUserIsOwner()
    {
        var commentRepositoryMock = new Mock<ICommentRepository>(MockBehavior.Strict);
        var postRepositoryMock = new Mock<IPostRepository>(MockBehavior.Strict);
        var notificationRepositoryMock = new Mock<INotificationRepository>(MockBehavior.Strict);
        var userManagerMock = CreateUserManagerMock();
        var (hubContextMock, _, _) = CreateNotificationHubContextMock();

        var service = new CommentsService(
            commentRepositoryMock.Object,
            postRepositoryMock.Object,
            notificationRepositoryMock.Object,
            hubContextMock.Object,
            userManagerMock.Object);

        const int commentId = 7;
        const string userId = "owner-1";
        var actor = new ApplicationUser { Id = userId, UserName = "owner" };
        var comment = new Comment { Id = commentId, UserId = userId, PostId = 10, Content = "owner comment" };

        userManagerMock
            .Setup(manager => manager.FindByIdAsync(userId))
            .ReturnsAsync(actor);

        commentRepositoryMock
            .Setup(repository => repository.GetByIdAsync(commentId))
            .ReturnsAsync(comment);

        userManagerMock
            .Setup(manager => manager.IsInRoleAsync(actor, AppRoles.Admin))
            .ReturnsAsync(false);

        commentRepositoryMock
            .Setup(repository => repository.Delete(comment));

        commentRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .ReturnsAsync(1);

        await service.DeleteCommentAsync(commentId, userId);

        commentRepositoryMock.Verify(repository => repository.Delete(comment), Times.Once);
        commentRepositoryMock.Verify(repository => repository.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteCommentAsync_ShouldDelete_WhenUserIsAdmin()
    {
        var commentRepositoryMock = new Mock<ICommentRepository>(MockBehavior.Strict);
        var postRepositoryMock = new Mock<IPostRepository>(MockBehavior.Strict);
        var notificationRepositoryMock = new Mock<INotificationRepository>(MockBehavior.Strict);
        var userManagerMock = CreateUserManagerMock();
        var (hubContextMock, _, _) = CreateNotificationHubContextMock();

        var service = new CommentsService(
            commentRepositoryMock.Object,
            postRepositoryMock.Object,
            notificationRepositoryMock.Object,
            hubContextMock.Object,
            userManagerMock.Object);

        const int commentId = 11;
        const string adminUserId = "admin-1";
        var actor = new ApplicationUser { Id = adminUserId, UserName = "admin" };
        var comment = new Comment { Id = commentId, UserId = "someone-else", PostId = 20, Content = "another comment" };

        userManagerMock
            .Setup(manager => manager.FindByIdAsync(adminUserId))
            .ReturnsAsync(actor);

        commentRepositoryMock
            .Setup(repository => repository.GetByIdAsync(commentId))
            .ReturnsAsync(comment);

        userManagerMock
            .Setup(manager => manager.IsInRoleAsync(actor, AppRoles.Admin))
            .ReturnsAsync(true);

        commentRepositoryMock
            .Setup(repository => repository.Delete(comment));

        commentRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .ReturnsAsync(1);

        await service.DeleteCommentAsync(commentId, adminUserId);

        commentRepositoryMock.Verify(repository => repository.Delete(comment), Times.Once);
        commentRepositoryMock.Verify(repository => repository.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task DeleteCommentAsync_ShouldThrowUnauthorized_WhenUserIsNotOwnerOrAdmin()
    {
        var commentRepositoryMock = new Mock<ICommentRepository>(MockBehavior.Strict);
        var postRepositoryMock = new Mock<IPostRepository>(MockBehavior.Strict);
        var notificationRepositoryMock = new Mock<INotificationRepository>(MockBehavior.Strict);
        var userManagerMock = CreateUserManagerMock();
        var (hubContextMock, _, _) = CreateNotificationHubContextMock();

        var service = new CommentsService(
            commentRepositoryMock.Object,
            postRepositoryMock.Object,
            notificationRepositoryMock.Object,
            hubContextMock.Object,
            userManagerMock.Object);

        const int commentId = 13;
        const string actorUserId = "random-user";
        var actor = new ApplicationUser { Id = actorUserId, UserName = "visitor" };
        var comment = new Comment { Id = commentId, UserId = "owner-2", PostId = 3, Content = "protected comment" };

        userManagerMock
            .Setup(manager => manager.FindByIdAsync(actorUserId))
            .ReturnsAsync(actor);

        commentRepositoryMock
            .Setup(repository => repository.GetByIdAsync(commentId))
            .ReturnsAsync(comment);

        userManagerMock
            .Setup(manager => manager.IsInRoleAsync(actor, AppRoles.Admin))
            .ReturnsAsync(false);

        var exception = await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => service.DeleteCommentAsync(commentId, actorUserId));

        Assert.Equal("You do not have permission to delete this comment.", exception.Message);

        commentRepositoryMock.Verify(repository => repository.Delete(It.IsAny<Comment>()), Times.Never);
        commentRepositoryMock.Verify(repository => repository.SaveChangesAsync(), Times.Never);
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

    private static (Mock<IHubContext<NotificationHub>> hubContextMock, Mock<IHubClients> hubClientsMock, Mock<IClientProxy> clientProxyMock) CreateNotificationHubContextMock()
    {
        var hubContextMock = new Mock<IHubContext<NotificationHub>>(MockBehavior.Strict);
        var hubClientsMock = new Mock<IHubClients>(MockBehavior.Strict);
        var clientProxyMock = new Mock<IClientProxy>(MockBehavior.Strict);

        hubContextMock
            .SetupGet(hub => hub.Clients)
            .Returns(hubClientsMock.Object);

        hubClientsMock
            .Setup(clients => clients.User(It.IsAny<string>()))
            .Returns(clientProxyMock.Object);

        clientProxyMock
            .Setup(proxy => proxy.SendCoreAsync(
                It.IsAny<string>(),
                It.IsAny<object?[]>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        return (hubContextMock, hubClientsMock, clientProxyMock);
    }
}
