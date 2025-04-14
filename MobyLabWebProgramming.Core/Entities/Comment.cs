namespace MobyLabWebProgramming.Core.Entities;

/// <summary>
/// This is an example for another entity to store files and an example for a One-To-Many relation.
/// </summary>
public class Comment : BaseEntity
{
    public Guid UserId { get; set; }
    public Guid TorrentId { get; set; }
    public string Text { get; set; } = null!;
    public User User { get; set; } = null!;
    public Torrent Torrent { get; set; } = null!;
}
