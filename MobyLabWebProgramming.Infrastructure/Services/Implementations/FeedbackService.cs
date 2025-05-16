using System.Net;
using System.Text.RegularExpressions;
using MailKit;
using MobyLabWebProgramming.Core.Constants;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Enums;
using MobyLabWebProgramming.Core.Errors;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Core.Specifications;
using MobyLabWebProgramming.Infrastructure.Database;
using MobyLabWebProgramming.Infrastructure.Repositories.Interfaces;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;
using MobyLabWebProgramming.Infrastructure.EntityConfigurations;
using Ardalis.Specification;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

/// <summary>
/// Inject the required services through the constructor.
/// </summary>
public class FeedbackService(IRepository<WebAppDatabaseContext> repository) : IFeedbackService
{
    private const string ALLOWED_CHARACTERS_REGEX = "^[!?.a-zA-Z0-9 ]*$";

    public async Task<ServiceResponse> AddFeedback(FeedbackSatisfactionEnum satisfaction, bool wouldRecommend, string text, UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        if (requestingUser == null) // Verify who can add the user, you can change this however you se fit.
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Need to be logged in to add a feedback!", ErrorCodes.CannotAdd));
        }

        if (text.Length == 0 || text.Length >= FeedbackConfiguration.MAX_FEEDBACK_LENGTH)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Invalid text size.", ErrorCodes.CannotAdd));
        }

        if (!Regex.IsMatch(text, ALLOWED_CHARACTERS_REGEX))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Illegal character in text.", ErrorCodes.CannotAdd));
        }

        await repository.AddAsync(new Feedback
        {
           UserId = requestingUser.Id,
           Text = text,
           Satisfaction = satisfaction,
           WouldRecommend = wouldRecommend,
        });

        //await repository.AddAsync(new User
        //{
        //    Email = user.Email,
        //    Name = user.Name,
        //    Role = user.Role,
        //    Password = user.Password
        //}, cancellationToken); // A new entity is created and persisted in the database.

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<PagedResponse<FeedbackDTO>>> GetFeedbacks(PaginationQueryParams pagination, CancellationToken cancellationToken = default)
    {
        var result = await repository.PageAsync(pagination, new FeedbackProjectionSpec(), cancellationToken); // Use the specification and pagination API to get only some entities from the database.

        return ServiceResponse.ForSuccess(result);
    }
}
