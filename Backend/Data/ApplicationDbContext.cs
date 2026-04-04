namespace InteractHub.Api.Data
{
    using InteractHub.Api.Models;
    using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
    using Microsoft.EntityFrameworkCore;

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Connection> Connections { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Configure Connections Many-to-Many self-referencing relationships
            builder.Entity<Connection>()
                .HasKey(c => new { c.FollowerId, c.FolloweeId });

            builder.Entity<Connection>()
                .HasOne(c => c.Follower)
                .WithMany()
                .HasForeignKey(c => c.FollowerId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Connection>()
                .HasOne(c => c.Followee)
                .WithMany()
                .HasForeignKey(c => c.FolloweeId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}