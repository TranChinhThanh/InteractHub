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
        public DbSet<Like> Likes { get; set; }
        public DbSet<Story> Stories { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Hashtag> Hashtags { get; set; }
        public DbSet<PostReport> PostReports { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Connection: self-referencing many-to-many on ApplicationUser
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

            // Post -> User can create cascade path loops through Comment/Like/PostReport
            builder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany()
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Comment has 2 required relationships (User, Post), both explicitly controlled
            builder.Entity<Comment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Like can target Post or Comment and also references User
            builder.Entity<Like>()
                .HasOne(l => l.Post)
                .WithMany()
                .HasForeignKey(l => l.PostId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Like>()
                .HasOne(l => l.Comment)
                .WithMany()
                .HasForeignKey(l => l.CommentId)
                .OnDelete(DeleteBehavior.NoAction);
                
            builder.Entity<Like>()
                .HasOne(l => l.User)
                .WithMany()
                .HasForeignKey(l => l.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // PostReport references both Reporter(User) and Post
            builder.Entity<PostReport>()
                .HasOne(pr => pr.Reporter)
                .WithMany()
                .HasForeignKey(pr => pr.ReporterId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<PostReport>()
                .HasOne(pr => pr.Post)
                .WithMany()
                .HasForeignKey(pr => pr.PostId)
                .OnDelete(DeleteBehavior.NoAction);

            // Story and Notification both depend on User
            builder.Entity<Story>()
                .HasOne(s => s.User)
                .WithMany()
                .HasForeignKey(s => s.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            builder.Entity<Notification>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Explicit many-to-many for Post and Hashtag
            builder.Entity<Post>()
                .HasMany(p => p.Hashtags)
                .WithMany(h => h.Posts)
                .UsingEntity(j => j.ToTable("PostHashtags"));
        }


    }
}