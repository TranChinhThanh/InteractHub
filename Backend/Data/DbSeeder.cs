namespace InteractHub.Api.Data
{
    using InteractHub.Api.Models;
    using InteractHub.Api.Security;
    using Microsoft.AspNetCore.Identity;
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
        }

        private static string JoinErrors(IdentityResult result)
        {
            return string.Join("; ", result.Errors.Select(error => error.Description));
        }
    }
}
