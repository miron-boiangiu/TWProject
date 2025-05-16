using MobyLabWebProgramming.Core.Enums;

namespace MobyLabWebProgramming.Core.DataTransferObjects;

/// <summary>
/// This DTO is used to add a user, note that it doesn't have an id property because the id for the user entity should be added by the application.
/// </summary>
public class FeedbackAddDTO
{
    public string Text { get; set; } = null!;

    public FeedbackSatisfactionEnum Satisfaction { get; set; }

    public bool WouldRecommend { get; set; }
}
