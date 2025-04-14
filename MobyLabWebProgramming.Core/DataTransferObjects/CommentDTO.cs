namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class CommentDTO
{
    public Guid Id { get; set; }

    public UserDTO User { get; set; } = null!;

    public TorrentDTO Torrent { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public string Text { get; set; } = null!;
}
