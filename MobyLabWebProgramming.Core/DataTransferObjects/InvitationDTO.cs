namespace MobyLabWebProgramming.Core.DataTransferObjects;

public class InvitationDTO
{
    public Guid Id { get; set; }

    public UserDTO? CreatedUser { get; set; }

    public UserDTO GeneratedByUser { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public bool Used { get; set; }
}
