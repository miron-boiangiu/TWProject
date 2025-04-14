using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

/// <summary>
/// This is a specification to filter the user file entities and map it to and UserFileDTO object via the constructors.
/// Note how the constructors call the base class's constructors. Also, this is a sealed class, meaning it cannot be further derived.
/// </summary>
public sealed class LikeProjectionSpec : Specification<Like, LikeDTO>
{
    /// <summary>
    /// Note that the specification projects the UserFile onto UserFileDTO together with the referenced User entity properties.
    /// </summary>
    public LikeProjectionSpec(bool orderByCreatedAt = false) =>
        Query.Select(e => new()
        {
            Id = e.Id,
            User = new()
            {
                Id = e.User.Id,
                Email = e.User.Email,
                Name = e.User.Name,
                Role = e.User.Role
            },
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt,
            Torrent = new()
            {
                Id = e.Torrent.Id,
                Name = e.Torrent.Name,
                Description = e.Torrent.Description,
                User = new()
                {
                    Id = e.Torrent.User.Id,
                    Email = e.Torrent.User.Email,
                    Name = e.Torrent.User.Name,
                    Role = e.Torrent.User.Role
                },
                CreatedAt = e.Torrent.CreatedAt,
                UpdatedAt = e.Torrent.UpdatedAt,
            }
        })
        .OrderByDescending(x => x.CreatedAt, orderByCreatedAt);

    public LikeProjectionSpec(Guid id): this() => Query.Where(e => e.Id == id);

    public LikeProjectionSpec(Guid userId, Guid torrentId) : this(true)
    {
        Query.Where(e => e.UserId == userId && e.TorrentId == torrentId);
    }
}
