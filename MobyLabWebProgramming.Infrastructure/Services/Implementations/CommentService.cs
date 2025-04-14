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

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

/// <summary>
/// Inject the required services through the constructor.
/// </summary>
public class CommentService(IRepository<WebAppDatabaseContext> repository) : ICommentService
{
    private const string ALLOWED_CHARACTERS_REGEX = "^[!?.a-zA-Z0-9 ]*$";

    public async Task<ServiceResponse> AddComment(Guid torrentId, string text, UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        if (requestingUser == null) // Verify who can add the user, you can change this however you se fit.
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Need to be logged in to add a comment!", ErrorCodes.CannotDelete));
        }

        var torrent = await repository.GetAsync(new UserFileProjectionSpec(torrentId), cancellationToken); // First get the file entity from the database to find the location on the filesystem.

        if (torrent == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Cannot find the torrent!", ErrorCodes.EntityNotFound));
        }

        if (text.Length == 0 || text.Length >= CommentConfiguration.MAX_COMMENT_LENGTH)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Invalid text size.", ErrorCodes.CannotAdd));
        }

        if (!Regex.IsMatch(text, ALLOWED_CHARACTERS_REGEX))
        {
            return ServiceResponse.FromError(new(HttpStatusCode.BadRequest, "Illegal character in text.", ErrorCodes.CannotAdd));
        }

        await repository.AddAsync(new Comment
        {
           UserId = requestingUser.Id,
           TorrentId = torrentId,
           Text = text,
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

    public async Task<ServiceResponse<PagedResponse<CommentDTO>>> GetComments(CommentPaginationSearchQueryParams pagination, CancellationToken cancellationToken = default)
    {
        var torrent = await repository.GetAsync(new UserFileProjectionSpec(pagination.torrentId), cancellationToken); // First get the file entity from the database to find the location on the filesystem.

        if (torrent == null)
        {
            return ServiceResponse.FromError<PagedResponse<CommentDTO>>(new(HttpStatusCode.NotFound, "Cannot find the torrent!", ErrorCodes.EntityNotFound));
        }

        var result = await repository.PageAsync(pagination, new CommentProjectionSpec(torrent), cancellationToken); // Use the specification and pagination API to get only some entities from the database.

        return ServiceResponse.ForSuccess(result);
    }

    public async Task<ServiceResponse> DeleteComment(Guid id, UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        if (requestingUser == null) // Verify who can add the user, you can change this however you se fit.
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Need to be logged in to delete a comment!", ErrorCodes.CannotDelete));
        }

        var comment = await repository.GetAsync(new CommentProjectionSpec(id), cancellationToken); // First get the file entity from the database to find the location on the filesystem.

        if (comment == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Cannot find the comment!", ErrorCodes.EntityNotFound));
        }

        if (requestingUser.Role != UserRoleEnum.Admin && requestingUser.Id != comment.User.Id)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Unauthorized, "You can only delete your own comment.", ErrorCodes.CannotDelete));
        }

        await repository.DeleteAsync<Comment>(comment.Id, cancellationToken); // Delete the entity.

        return ServiceResponse.ForSuccess();
    }
}
