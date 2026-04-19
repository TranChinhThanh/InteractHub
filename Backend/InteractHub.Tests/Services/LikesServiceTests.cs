namespace InteractHub.Tests.Services;

using InteractHub.Api.Hubs;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Services;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Moq;

public sealed class LikesServiceTests
{
    [Fact]
    public async Task TogglePostLikeAsync_ShouldAddLike_WhenNotLikedYet()
    {
        var likeRepositoryMock = new Mock<ILikeRepository>(MockBehavior.Strict);
        var postRepositoryMock = new Mock<IPostRepository>(MockBehavior.Strict);
        var commentRepositoryMock = new Mock<ICommentRepository>(MockBehavior.Strict);
        var notificationRepositoryMock = new Mock<INotificationRepository>(MockBehavior.Strict);
        var userManagerMock = CreateUserManagerMock();
        var (hubContextMock, _, _) = CreateNotificationHubContextMock();

        var service = new LikesService(
            likeRepositoryMock.Object,
            postRepositoryMock.Object,
            commentRepositoryMock.Object,
            notificationRepositoryMock.Object,
            hubContextMock.Object,
            userManagerMock.Object);

        const int postId = 30;
        const string userId = "user-1";
        var post = new Post { Id = postId, UserId = userId, Content = "self post" };

        postRepositoryMock
            .Setup(repository => repository.GetByIdAsync(postId))
            .ReturnsAsync(post);

        likeRepositoryMock
            .Setup(repository => repository.GetPostLikeAsync(postId, userId))
            .ReturnsAsync((Like?)null);

        likeRepositoryMock
            .Setup(repository => repository.AddAsync(It.Is<Like>(like =>
                like.PostId == postId
                && like.CommentId == null
                && like.UserId == userId)))
            .Returns(Task.CompletedTask);

        likeRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .ReturnsAsync(1);

        var result = await service.TogglePostLikeAsync(postId, userId);

        Assert.True(result.IsLiked);

        likeRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Like>()), Times.Once);
        likeRepositoryMock.Verify(repository => repository.Delete(It.IsAny<Like>()), Times.Never);
        likeRepositoryMock.Verify(repository => repository.SaveChangesAsync(), Times.Once);
        notificationRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Notification>()), Times.Never);
    }

    [Fact]
    public async Task TogglePostLikeAsync_ShouldRemoveLike_WhenAlreadyLiked()
    {
        var likeRepositoryMock = new Mock<ILikeRepository>(MockBehavior.Strict);
        var postRepositoryMock = new Mock<IPostRepository>(MockBehavior.Strict);
        var commentRepositoryMock = new Mock<ICommentRepository>(MockBehavior.Strict);
        var notificationRepositoryMock = new Mock<INotificationRepository>(MockBehavior.Strict);
        var userManagerMock = CreateUserManagerMock();
        var (hubContextMock, _, _) = CreateNotificationHubContextMock();

        var service = new LikesService(
            likeRepositoryMock.Object,
            postRepositoryMock.Object,
            commentRepositoryMock.Object,
            notificationRepositoryMock.Object,
            hubContextMock.Object,
            userManagerMock.Object);

        const int postId = 31;
        const string userId = "user-2";
        var post = new Post { Id = postId, UserId = "owner-2", Content = "another post" };
        var existingLike = new Like { Id = 90, PostId = postId, UserId = userId };

        postRepositoryMock
            .Setup(repository => repository.GetByIdAsync(postId))
            .ReturnsAsync(post);

        likeRepositoryMock
            .Setup(repository => repository.GetPostLikeAsync(postId, userId))
            .ReturnsAsync(existingLike);

        likeRepositoryMock
            .Setup(repository => repository.Delete(existingLike));

        likeRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .ReturnsAsync(1);

        var result = await service.TogglePostLikeAsync(postId, userId);

        Assert.False(result.IsLiked);

        likeRepositoryMock.Verify(repository => repository.Delete(existingLike), Times.Once);
        likeRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Like>()), Times.Never);
        likeRepositoryMock.Verify(repository => repository.SaveChangesAsync(), Times.Once);
        notificationRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Notification>()), Times.Never);
    }

    [Fact]
    public async Task TogglePostLikeAsync_ShouldThrowInvalidOperation_WhenPostDoesNotExist()
    {
        var likeRepositoryMock = new Mock<ILikeRepository>(MockBehavior.Strict);
        var postRepositoryMock = new Mock<IPostRepository>(MockBehavior.Strict);
        var commentRepositoryMock = new Mock<ICommentRepository>(MockBehavior.Strict);
        var notificationRepositoryMock = new Mock<INotificationRepository>(MockBehavior.Strict);
        var userManagerMock = CreateUserManagerMock();
        var (hubContextMock, _, _) = CreateNotificationHubContextMock();

        var service = new LikesService(
            likeRepositoryMock.Object,
            postRepositoryMock.Object,
            commentRepositoryMock.Object,
            notificationRepositoryMock.Object,
            hubContextMock.Object,
            userManagerMock.Object);

        const int postId = 404;

        postRepositoryMock
            .Setup(repository => repository.GetByIdAsync(postId))
            .ReturnsAsync((Post?)null);

        var exception = await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.TogglePostLikeAsync(postId, "user-3"));

        Assert.Equal("Post not found.", exception.Message);

        likeRepositoryMock.Verify(repository => repository.GetPostLikeAsync(It.IsAny<int>(), It.IsAny<string>()), Times.Never);
        likeRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Like>()), Times.Never);
        likeRepositoryMock.Verify(repository => repository.Delete(It.IsAny<Like>()), Times.Never);
    }

    [Fact]
    public async Task ToggleCommentLikeAsync_ShouldAddLike_WhenNotLikedYet()
    {
        var likeRepositoryMock = new Mock<ILikeRepository>(MockBehavior.Strict);
        var postRepositoryMock = new Mock<IPostRepository>(MockBehavior.Strict);
        var commentRepositoryMock = new Mock<ICommentRepository>(MockBehavior.Strict);
        var notificationRepositoryMock = new Mock<INotificationRepository>(MockBehavior.Strict);
        var userManagerMock = CreateUserManagerMock();
        var (hubContextMock, _, _) = CreateNotificationHubContextMock();

        var service = new LikesService(
            likeRepositoryMock.Object,
            postRepositoryMock.Object,
            commentRepositoryMock.Object,
            notificationRepositoryMock.Object,
            hubContextMock.Object,
            userManagerMock.Object);

        const int commentId = 44;
        const string userId = "user-4";
        var comment = new Comment { Id = commentId, UserId = "comment-owner", PostId = 9, Content = "comment" };

        commentRepositoryMock
            .Setup(repository => repository.GetByIdAsync(commentId))
            .ReturnsAsync(comment);

        likeRepositoryMock
            .Setup(repository => repository.GetCommentLikeAsync(commentId, userId))
            .ReturnsAsync((Like?)null);

        likeRepositoryMock
            .Setup(repository => repository.AddAsync(It.Is<Like>(like =>
                like.CommentId == commentId
                && like.PostId == null
                && like.UserId == userId)))
            .Returns(Task.CompletedTask);

        likeRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .ReturnsAsync(1);

        var result = await service.ToggleCommentLikeAsync(commentId, userId);

        Assert.True(result.IsLiked);

        likeRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Like>()), Times.Once);
        likeRepositoryMock.Verify(repository => repository.Delete(It.IsAny<Like>()), Times.Never);
        likeRepositoryMock.Verify(repository => repository.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task ToggleCommentLikeAsync_ShouldRemoveLike_WhenAlreadyLiked()
    {
        var likeRepositoryMock = new Mock<ILikeRepository>(MockBehavior.Strict);
        var postRepositoryMock = new Mock<IPostRepository>(MockBehavior.Strict);
        var commentRepositoryMock = new Mock<ICommentRepository>(MockBehavior.Strict);
        var notificationRepositoryMock = new Mock<INotificationRepository>(MockBehavior.Strict);
        var userManagerMock = CreateUserManagerMock();
        var (hubContextMock, _, _) = CreateNotificationHubContextMock();

        var service = new LikesService(
            likeRepositoryMock.Object,
            postRepositoryMock.Object,
            commentRepositoryMock.Object,
            notificationRepositoryMock.Object,
            hubContextMock.Object,
            userManagerMock.Object);

        const int commentId = 45;
        const string userId = "user-5";
        var comment = new Comment { Id = commentId, UserId = "comment-owner", PostId = 11, Content = "comment" };
        var existingLike = new Like { Id = 91, CommentId = commentId, UserId = userId };

        commentRepositoryMock
            .Setup(repository => repository.GetByIdAsync(commentId))
            .ReturnsAsync(comment);

        likeRepositoryMock
            .Setup(repository => repository.GetCommentLikeAsync(commentId, userId))
            .ReturnsAsync(existingLike);

        likeRepositoryMock
            .Setup(repository => repository.Delete(existingLike));

        likeRepositoryMock
            .Setup(repository => repository.SaveChangesAsync())
            .ReturnsAsync(1);

        var result = await service.ToggleCommentLikeAsync(commentId, userId);

        Assert.False(result.IsLiked);

        likeRepositoryMock.Verify(repository => repository.Delete(existingLike), Times.Once);
        likeRepositoryMock.Verify(repository => repository.AddAsync(It.IsAny<Like>()), Times.Never);
        likeRepositoryMock.Verify(repository => repository.SaveChangesAsync(), Times.Once);
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
