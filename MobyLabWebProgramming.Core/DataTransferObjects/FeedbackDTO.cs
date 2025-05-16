using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class FeedbackDTO
{
    public Guid Id { get; set; }

    public UserDTO User { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string Text { get; set; } = null!;

    public FeedbackSatisfactionEnum Satisfaction { get; set; }

    public bool WouldRecommend { get; set; }
}
