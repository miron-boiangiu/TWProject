using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.Entities;

/// <summary>
/// This is an example for another entity to store files and an example for a One-To-Many relation.
/// </summary>
public class Feedback : BaseEntity
{
    public Guid UserId { get; set; }
    public string Text { get; set; } = null!;
    public User User { get; set; } = null!;
    public FeedbackSatisfactionEnum Satisfaction { get; set; }
    public bool WouldRecommend { get; set; }
}
