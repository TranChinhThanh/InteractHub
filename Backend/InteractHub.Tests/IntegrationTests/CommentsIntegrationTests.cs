namespace InteractHub.Tests.IntegrationTests;

using System.Net;
using InteractHub.Api.DTOs.Comments;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

public class CommentsIntegrationTests : IClassFixture<CommentsApiWebApplicationFactory>
{
    private readonly CommentsApiWebApplicationFactory _factory;

    public CommentsIntegrationTests(CommentsApiWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetComments_ForAnyPost_ReturnsOkAndJsonResponse()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/comments/post/1");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType?.ToString());
    }
}

public sealed class CommentsApiWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            services.RemoveAll(typeof(ICommentsService));
            services.AddScoped<ICommentsService, FakeCommentsService>();
        });
    }

    private sealed class FakeCommentsService : ICommentsService
    {
        public Task<CommentResponseDto> CreateCommentAsync(int postId, string userId, CreateCommentDto dto)
        {
            throw new NotSupportedException("CreateCommentAsync is not used in this integration test.");
        }

        public Task<IEnumerable<CommentResponseDto>> GetCommentsByPostIdAsync(int postId)
        {
            return Task.FromResult<IEnumerable<CommentResponseDto>>(Array.Empty<CommentResponseDto>());
        }

        public Task DeleteCommentAsync(int commentId, string userId)
        {
            throw new NotSupportedException("DeleteCommentAsync is not used in this integration test.");
        }
    }
}
