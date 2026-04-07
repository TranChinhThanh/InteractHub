namespace InteractHub.Api.Services;

using InteractHub.Api.Data;
using InteractHub.Api.DTOs.Posts;
using InteractHub.Api.Models;
using InteractHub.Api.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

public sealed class PostService : IPostService
{
    private const int MaxPageSize = 50;
    private const long MaxImageSizeBytes = 5 * 1024 * 1024;
    private static readonly HashSet<string> AllowedImageExtensions = new(StringComparer.OrdinalIgnoreCase)
    {
        ".jpg", ".jpeg", ".png", ".webp"
    };

    private readonly ApplicationDbContext _dbContext;
    private readonly IWebHostEnvironment _environment;

    public PostService(ApplicationDbContext dbContext, IWebHostEnvironment environment)
    {
        _dbContext = dbContext;
        _environment = environment;
    }

    public async Task<PostResponseDto> CreateAsync(string userId, CreatePostDto request)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            throw new InvalidOperationException("User not found.");
        }

        var post = new Post
        {
            Content = request.Content.Trim(),
            UserId = userId,
        };

        _dbContext.Posts.Add(post);
        await _dbContext.SaveChangesAsync();

        return ToPostResponse(post, user);
    }

    public async Task<PostResponseDto> CreateWithImageAsync(string userId, CreatePostWithImageDto request)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
        {
            throw new InvalidOperationException("User not found.");
        }

        ValidateImage(request.Image);
        var imageUrl = await SaveImageAsync(request.Image);

        var post = new Post
        {
            Content = request.Content.Trim(),
            UserId = userId,
            ImageUrl = imageUrl,
        };

        _dbContext.Posts.Add(post);
        await _dbContext.SaveChangesAsync();

        return ToPostResponse(post, user);
    }

    public async Task<PostResponseDto?> GetByIdAsync(int postId)
    {
        var post = await _dbContext.Posts
            .AsNoTracking()
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == postId);

        return post is null ? null : ToPostResponse(post, post.User);
    }

    public async Task<PostListResponseDto> GetAllAsync(int pageNumber, int pageSize)
    {
        var safePageNumber = pageNumber < 1 ? 1 : pageNumber;
        var safePageSize = pageSize < 1 ? 10 : Math.Min(pageSize, MaxPageSize);

        var query = _dbContext.Posts
            .AsNoTracking()
            .Include(p => p.User)
            .OrderByDescending(p => p.CreatedAt)
            .AsQueryable();

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((safePageNumber - 1) * safePageSize)
            .Take(safePageSize)
            .ToListAsync();

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
        var post = await _dbContext.Posts
            .Include(p => p.User)
            .FirstOrDefaultAsync(p => p.Id == postId);

        if (post is null || !string.Equals(post.UserId, userId, StringComparison.Ordinal))
        {
            return null;
        }

        post.Content = request.Content.Trim();
        await _dbContext.SaveChangesAsync();

        return ToPostResponse(post, post.User);
    }

    public async Task<bool> DeleteAsync(int postId, string userId)
    {
        var post = await _dbContext.Posts
            .FirstOrDefaultAsync(p => p.Id == postId);

        if (post is null || !string.Equals(post.UserId, userId, StringComparison.Ordinal))
        {
            return false;
        }

        _dbContext.Posts.Remove(post);
        await _dbContext.SaveChangesAsync();
        return true;
    }

    private static PostResponseDto ToPostResponse(Post post, ApplicationUser? user)
    {
        return new PostResponseDto
        {
            Id = post.Id,
            Content = post.Content,
            ImageUrl = post.ImageUrl,
            CreatedAt = post.CreatedAt,
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
}
