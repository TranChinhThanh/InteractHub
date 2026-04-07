using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InteractHub.Api.Models
{
    public class Like
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;
        
        [ForeignKey(nameof(UserId))]
        public ApplicationUser? User { get; set; }

        // Either PostId or CommentId should be set
        public int? PostId { get; set; }
        [ForeignKey(nameof(PostId))]
        public Post? Post { get; set; }

        public int? CommentId { get; set; }
        [ForeignKey(nameof(CommentId))]
        public Comment? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
