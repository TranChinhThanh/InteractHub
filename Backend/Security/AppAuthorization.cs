namespace InteractHub.Api.Security;

public static class AppRoles
{
    public const string User = "User";
    public const string Admin = "Admin";

    public static readonly string[] All = new[] { User, Admin };
}

public static class AppPolicies
{
    public const string SelfOrAdmin = "SelfOrAdmin";
}
