namespace MobyLabWebProgramming.Core.Entities;

/// <summary>
/// This is an example for another entity to store files and an example for a One-To-Many relation.
/// </summary>
public class Invitation : BaseEntity
{
    public Guid? CreatedUserId { get; set; }
    public User? CreatedUser { get; set; } = null;
    public Guid GeneratedByUserId { get; set; }
    public User GeneratedByUser { get; set; } = null!;
}
