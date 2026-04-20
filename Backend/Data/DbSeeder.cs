namespace InteractHub.Api.Data
{
    using InteractHub.Api.Models;
    using InteractHub.Api.Security;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.DependencyInjection;

    public static class DbSeeder
    {
        public static async Task SeedDataAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

            foreach (var roleName in AppRoles.All)
            {
                var roleExists = await roleManager.RoleExistsAsync(roleName);
                if (roleExists)
                {
                    continue;
                }

                var createRoleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                if (!createRoleResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        $"Failed to seed role '{roleName}': {JoinErrors(createRoleResult)}");
                }
            }

            const string adminUserName = "admin";
            const string adminEmail = "admin@interacthub.com";
            const string adminPassword = "Admin@123";

            var adminUser = await userManager.FindByNameAsync(adminUserName);
            if (adminUser is null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminUserName,
                    Email = adminEmail,
                    FullName = "System Admin",
                    EmailConfirmed = true,
                };

                var createUserResult = await userManager.CreateAsync(adminUser, adminPassword);
                if (!createUserResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        $"Failed to seed admin user '{adminUserName}': {JoinErrors(createUserResult)}");
                }
            }

            var isAdmin = await userManager.IsInRoleAsync(adminUser, AppRoles.Admin);
            if (!isAdmin)
            {
                var addToRoleResult = await userManager.AddToRoleAsync(adminUser, AppRoles.Admin);
                if (!addToRoleResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        $"Failed to assign role '{AppRoles.Admin}' to user '{adminUserName}': {JoinErrors(addToRoleResult)}");
                }
            }

            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            const string defaultUserPassword = "User@123";

            var aliceUser = await EnsureRegularUserAsync(
                userManager,
                userName: "alice",
                email: "alice@interacthub.com",
                fullName: "Alice Nguyen",
                password: defaultUserPassword);

            var bobUser = await EnsureRegularUserAsync(
                userManager,
                userName: "bob",
                email: "bob@interacthub.com",
                fullName: "Bob Tran",
                password: defaultUserPassword);

            if (!context.Posts.Any())
            {
                var hashtagNames = new[] { "#welcome", "#interacthub", "#dotnet" };
                var existingHashtags = await context.Hashtags
                    .Where(h => hashtagNames.Contains(h.Name))
                    .ToListAsync();

                var hashtagLookup = existingHashtags
                    .ToDictionary(h => h.Name, StringComparer.OrdinalIgnoreCase);

                foreach (var hashtagName in hashtagNames)
                {
                    if (hashtagLookup.ContainsKey(hashtagName))
                    {
                        continue;
                    }

                    var hashtag = new Hashtag { Name = hashtagName };
                    context.Hashtags.Add(hashtag);
                    hashtagLookup[hashtagName] = hashtag;
                }

                var aliceWelcomePost = new Post
                {
                    UserId = aliceUser.Id,
                    Content = "Chao mung moi nguoi den voi InteractHub. Minh rat hao huc chia se hanh trinh hoc .NET cung moi nguoi!",
                    CreatedAt = DateTime.UtcNow.AddMinutes(-40),
                };
                aliceWelcomePost.Hashtags.Add(hashtagLookup["#welcome"]);
                aliceWelcomePost.Hashtags.Add(hashtagLookup["#interacthub"]);

                var bobDotNetPost = new Post
                {
                    UserId = bobUser.Id,
                    Content = "Vua hoan thanh endpoint dau tien voi ASP.NET Core va EF Core. Cam giac that tuyet khi moi thu da chay on dinh!",
                    CreatedAt = DateTime.UtcNow.AddMinutes(-25),
                };
                bobDotNetPost.Hashtags.Add(hashtagLookup["#dotnet"]);
                bobDotNetPost.Hashtags.Add(hashtagLookup["#interacthub"]);

                var aliceSecondPost = new Post
                {
                    UserId = aliceUser.Id,
                    Content = "Hom nay minh da toi uu API response format va bo sung XML docs cho Swagger. Team code review rat muot!",
                    CreatedAt = DateTime.UtcNow.AddMinutes(-10),
                };
                aliceSecondPost.Hashtags.Add(hashtagLookup["#dotnet"]);

                context.Posts.AddRange(aliceWelcomePost, bobDotNetPost, aliceSecondPost);
                await context.SaveChangesAsync();

                var comments = new List<Comment>
                {
                    new()
                    {
                        PostId = aliceWelcomePost.Id,
                        UserId = bobUser.Id,
                        Content = "Chao mung Alice! Mong duoc hoc hoi them kinh nghiem tu ban.",
                        CreatedAt = DateTime.UtcNow.AddMinutes(-8),
                    },
                    new()
                    {
                        PostId = aliceSecondPost.Id,
                        UserId = bobUser.Id,
                        Content = "Xin qua! Swagger docs day du se giup frontend tich hop nhanh hon rat nhieu.",
                        CreatedAt = DateTime.UtcNow.AddMinutes(-6),
                    },
                };

                var likes = new List<Like>
                {
                    new()
                    {
                        PostId = bobDotNetPost.Id,
                        UserId = aliceUser.Id,
                        CreatedAt = DateTime.UtcNow.AddMinutes(-5),
                    },
                    new()
                    {
                        PostId = bobDotNetPost.Id,
                        UserId = adminUser.Id,
                        CreatedAt = DateTime.UtcNow.AddMinutes(-4),
                    },
                };

                context.Comments.AddRange(comments);
                context.Likes.AddRange(likes);
                await context.SaveChangesAsync();
            }
        }

        private static async Task<ApplicationUser> EnsureRegularUserAsync(
            UserManager<ApplicationUser> userManager,
            string userName,
            string email,
            string fullName,
            string password)
        {
            var user = await userManager.FindByNameAsync(userName);
            if (user is null)
            {
                user = new ApplicationUser
                {
                    UserName = userName,
                    Email = email,
                    FullName = fullName,
                    EmailConfirmed = true,
                };

                var createUserResult = await userManager.CreateAsync(user, password);
                if (!createUserResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        $"Failed to seed regular user '{userName}': {JoinErrors(createUserResult)}");
                }
            }

            var isUserRole = await userManager.IsInRoleAsync(user, AppRoles.User);
            if (!isUserRole)
            {
                var addToRoleResult = await userManager.AddToRoleAsync(user, AppRoles.User);
                if (!addToRoleResult.Succeeded)
                {
                    throw new InvalidOperationException(
                        $"Failed to assign role '{AppRoles.User}' to user '{userName}': {JoinErrors(addToRoleResult)}");
                }
            }

            return user;
        }

        private static string JoinErrors(IdentityResult result)
        {
            return string.Join("; ", result.Errors.Select(error => error.Description));
        }
    }
}
