namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class LikeDTO
{
    public Guid Id { get; set; }

    public UserDTO User { get; set; } = null!;

    public TorrentDTO Torrent { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
