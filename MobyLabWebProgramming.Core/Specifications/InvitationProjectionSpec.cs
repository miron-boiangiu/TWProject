using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

/// <summary>
/// This is a specification to filter the user file entities and map it to and UserFileDTO object via the constructors.
/// Note how the constructors call the base class's constructors. Also, this is a sealed class, meaning it cannot be further derived.
/// </summary>
public sealed class InvitationProjectionSpec : Specification<Invitation, InvitationDTO>
{
    /// <summary>
    /// Note that the specification projects the UserFile onto UserFileDTO together with the referenced User entity properties.
    /// </summary>
    public InvitationProjectionSpec(bool orderByCreatedAt = true) =>
        Query.Select(e => new()
        {
            Id = e.Id,
            GeneratedByUser = new()
            {
                Id = e.GeneratedByUser.Id,
                Email = e.GeneratedByUser.Email,
                Name = e.GeneratedByUser.Name,
                Role = e.GeneratedByUser.Role
            },
            CreatedUser = e.CreatedUser == null ? null : new()
            {
                Id = e.CreatedUser.Id,
                Email = e.CreatedUser.Email,
                Name = e.CreatedUser.Name,
                Role = e.CreatedUser.Role
            },
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt,
            Used = e.CreatedUser != null,
        })
        .OrderByDescending(x => x.CreatedAt, orderByCreatedAt);

    public InvitationProjectionSpec(Guid id): this() => Query.Where(e => e.Id == id);
}
