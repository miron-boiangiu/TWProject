using Ardalis.Specification;
using Microsoft.EntityFrameworkCore;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;

namespace MobyLabWebProgramming.Core.Specifications;

/// <summary>
/// This is a specification to filter the user file entities and map it to and UserFileDTO object via the constructors.
/// Note how the constructors call the base class's constructors. Also, this is a sealed class, meaning it cannot be further derived.
/// </summary>
public sealed class FeedbackProjectionSpec : Specification<Feedback, FeedbackDTO>
{
    /// <summary>
    /// Note that the specification projects the UserFile onto UserFileDTO together with the referenced User entity properties.
    /// </summary>
    public FeedbackProjectionSpec(bool orderByCreatedAt = true)
    {
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
                Text = e.Text,
                WouldRecommend = e.WouldRecommend,
                Satisfaction = e.Satisfaction,
            })
            .OrderByDescending(x => x.CreatedAt, orderByCreatedAt);
     
    }

    public FeedbackProjectionSpec(Guid id): this() => Query.Where(e => e.Id == id);
}
