namespace InteractHub.Api.Services;

using System.Text.RegularExpressions;
using InteractHub.Api.DTOs.Posts;
using InteractHub.Api.Models;
using InteractHub.Api.Repositories.Interfaces;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

public sealed class PostService : IPostService
{
    private const int MaxPageSize = 50;
    private const long MaxImageSizeBytes = 5 * 1024 * 1024;
    private const int MaxHashtagCount = 20;
    private static readonly Regex HashtagRegex = new(@"(?<!\w)#([A-Za-z0-9_]{1,100})", RegexOptions.Compiled);
    private static readonly HashSet<string> AllowedImageExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };

    private readonly IPostRepository _postRepository;
    private readonly ICommentRepository _commentRepository;
    private readonly ILikeRepository _likeRepository;
    private readonly IReportRepository _reportRepository;
    private readonly IGenericRepository<Hashtag> _hashtagRepository;
    private readonly IWebHostEnvironment _environment;

    public PostService(
        IPostRepository postRepository,
        ICommentRepository commentRepository,
        ILikeRepository likeRepository,
        IReportRepository reportRepository,
        IGenericRepository<Hashtag> hashtagRepository,
        IWebHostEnvironment environment)
    {
        _postRepository = postRepository;
        _commentRepository = commentRepository;
        _likeRepository = likeRepository;
        _reportRepository = reportRepository;
        _hashtagRepository = hashtagRepository;
        _environment = environment;
    }

    public async Task<PostResponseDto> CreateAsync(string userId, CreatePostDto request)
    {
        var post = new Post
        {
            Content = request.Content.Trim(),
            UserId = userId,
        };

        await _postRepository.AddAsync(post);
        await ApplyHashtagsAsync(post, post.Content);
        await SavePostChangesWithUserValidationAsync();

        var createdPost = await _postRepository.GetPostWithDetailsByIdAsync(post.Id)
            ?? throw new InvalidOperationException("Unable to load created post.");

        return ToPostResponse(createdPost, createdPost.User);
    }

    public async Task<PostResponseDto> CreateWithImageAsync(string userId, CreatePostWithImageDto request)
    {
        ValidateImage(request.Image);
        var imageUrl = await SaveImageAsync(request.Image);

        var post = new Post
        {
            Content = request.Content.Trim(),
            UserId = userId,
            ImageUrl = imageUrl,
        };

        await _postRepository.AddAsync(post);
        await ApplyHashtagsAsync(post, post.Content);
        await SavePostChangesWithUserValidationAsync();

        var createdPost = await _postRepository.GetPostWithDetailsByIdAsync(post.Id)
            ?? throw new InvalidOperationException("Unable to load created post.");

        return ToPostResponse(createdPost, createdPost.User);
    }

    public async Task<PostResponseDto?> GetByIdAsync(int postId)
    {
        var post = await _postRepository.GetPostWithDetailsByIdAsync(postId);

        return post is null ? null : ToPostResponse(post, post.User);
    }

    public async Task<PostListResponseDto> GetAllAsync(int pageNumber, int pageSize)
    {
        var safePageNumber = pageNumber < 1 ? 1 : pageNumber;
        var safePageSize = pageSize < 1 ? 10 : Math.Min(pageSize, MaxPageSize);

        var allPosts = (await _postRepository.GetAllPostsWithDetailsAsync()).ToList();

        var totalCount = allPosts.Count;
        var items = allPosts
            .Skip((safePageNumber - 1) * safePageSize)
            .Take(safePageSize)
            .ToList();

        return new PostListResponseDto
        {
            Items = items.Select(post => ToPostResponse(post, post.User)).ToList(),
            PageNumber = safePageNumber,
            PageSize = safePageSize,
            TotalCount = totalCount,
        };
    }

    public async Task<PostResponseDto?> UpdateAsync(int postId, string userId, UpdatePostDto request)
    {
        var post = await _postRepository.GetPostWithDetailsByIdAsync(postId);

        if (post is null || !string.Equals(post.UserId, userId, StringComparison.Ordinal))
        {
            return null;
        }

        post.Content = request.Content.Trim();
        await ApplyHashtagsAsync(post, post.Content);
        _postRepository.Update(post);
        await _postRepository.SaveChangesAsync();

        return ToPostResponse(post, post.User);
    }

    public async Task<bool> DeleteAsync(int postId, string userId)
    {
        var post = await _postRepository.GetByIdAsync(postId);

        if (post is null || !string.Equals(post.UserId, userId, StringComparison.Ordinal))
        {
            return false;
        }

        var commentIds = await _commentRepository.GetCommentIdsByPostIdAsync(postId);

        await _likeRepository.DeleteByPostIdAsync(postId);
        await _likeRepository.DeleteByCommentIdsAsync(commentIds);
        await _reportRepository.DeleteByPostIdAsync(postId);
        await _commentRepository.DeleteByPostIdAsync(postId);

        _postRepository.Delete(post);
        await _postRepository.SaveChangesAsync();
        return true;
    }

    private static PostResponseDto ToPostResponse(Post post, ApplicationUser? user)
    {
        return new PostResponseDto
        {
            Id = post.Id,
            UserId = post.UserId,
            UserName = user?.UserName ?? string.Empty,
            UserAvatarUrl = user?.ProfilePictureUrl,
            Content = post.Content,
            ImageUrl = post.ImageUrl,
            CreatedAt = post.CreatedAt,
            LikeCount = post.Likes.Count,
            CommentCount = post.Comments.Count,
            Hashtags = post.Hashtags
                .Select(h => $"#{h.Name}")
                .OrderBy(name => name)
                .ToList(),
            Author = new PostAuthorDto
            {
                Id = post.UserId,
                Username = user?.UserName ?? string.Empty,
                FullName = user?.FullName,
            },
        };
    }

    private static void ValidateImage(IFormFile image)
    {
        if (image.Length <= 0)
        {
            throw new ArgumentException("Image file is empty.");
        }

        if (image.Length > MaxImageSizeBytes)
        {
            throw new ArgumentException("Image size exceeds 5MB limit.");
        }

        var extension = Path.GetExtension(image.FileName);
        if (!AllowedImageExtensions.Contains(extension))
        {
            throw new ArgumentException("Unsupported image format. Allowed: .jpg, .jpeg, .png, .webp");
        }
    }

    private async Task<string> SaveImageAsync(IFormFile image)
    {
        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrWhiteSpace(webRoot))
        {
            webRoot = Path.Combine(_environment.ContentRootPath, "wwwroot");
        }

        var uploadsDir = Path.Combine(webRoot, "uploads", "posts");
        Directory.CreateDirectory(uploadsDir);

        var extension = Path.GetExtension(image.FileName);
        var fileName = $"{Guid.NewGuid():N}{extension}";
        var fullPath = Path.Combine(uploadsDir, fileName);

        await using var stream = new FileStream(fullPath, FileMode.Create);
        await image.CopyToAsync(stream);

        return $"/uploads/posts/{fileName}";
    }

    private async Task ApplyHashtagsAsync(Post post, string content)
    {
        var hashtagNames = ExtractHashtagNames(content);
        post.Hashtags.Clear();

        if (hashtagNames.Count == 0)
        {
            return;
        }

        var hashtagNameSet = hashtagNames.ToHashSet(StringComparer.OrdinalIgnoreCase);

        var existingHashtags = (await _hashtagRepository.GetAllAsync())
            .Where(h => hashtagNameSet.Contains(h.Name))
            .ToList();

        var existingNames = existingHashtags
            .Select(h => h.Name)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var newHashtags = hashtagNames
            .Where(name => !existingNames.Contains(name))
            .Select(name => new Hashtag { Name = name })
            .ToList();

        foreach (var hashtag in newHashtags)
        {
            await _hashtagRepository.AddAsync(hashtag);
        }

        foreach (var hashtag in existingHashtags.Concat(newHashtags))
        {
            post.Hashtags.Add(hashtag);
        }
    }

    private async Task SavePostChangesWithUserValidationAsync()
    {
        try
        {
            await _postRepository.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            throw new InvalidOperationException("Unable to create post for current user.");
        }
    }

    private static IReadOnlyList<string> ExtractHashtagNames(string content)
    {
        var names = HashtagRegex.Matches(content)
            .Select(match => match.Groups[1].Value)
            .Where(value => !string.IsNullOrWhiteSpace(value))
            .Select(value => value.ToLowerInvariant())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (names.Count > MaxHashtagCount)
        {
            throw new ArgumentException($"A post supports up to {MaxHashtagCount} hashtags.");
        }

        return names;
    }
}
