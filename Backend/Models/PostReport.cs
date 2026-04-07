using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InteractHub.Api.Models
{
    public class PostReport
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public string ReporterId { get; set; } = string.Empty;
        
        [ForeignKey(nameof(ReporterId))]
        public ApplicationUser? Reporter { get; set; }

        [Required]
        public int PostId { get; set; }
        
        [ForeignKey(nameof(PostId))]
        public Post? Post { get; set; }
    }
}
