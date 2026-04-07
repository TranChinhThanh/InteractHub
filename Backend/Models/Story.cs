using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InteractHub.Api.Models
{
    public class Story
    {
        [Key]
        public int Id { get; set; }

        public string? ImageUrl { get; set; }
        
        [MaxLength(500)]
        public string? TextContent { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddHours(24);

        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [ForeignKey(nameof(UserId))]
        public ApplicationUser? User { get; set; }
    }
}
