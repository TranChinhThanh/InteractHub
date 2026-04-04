namespace InteractHub.Api.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Connection
    {
        [Required]
        public string FollowerId { get; set; } = string.Empty;

        [ForeignKey("FollowerId")]
        public ApplicationUser? Follower { get; set; }

        [Required]
        public string FolloweeId { get; set; } = string.Empty;

        [ForeignKey("FolloweeId")]
        public ApplicationUser? Followee { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}