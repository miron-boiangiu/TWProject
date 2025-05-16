using System.Net;
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

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

/// <summary>
/// Inject the required services through the constructor.
/// </summary>
public class LikeService(IRepository<WebAppDatabaseContext> repository, IMailService mailService) : ILikeService
{
    public async Task<ServiceResponse> AddLike(Guid torrentId, UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        if (requestingUser == null) // Verify who can add the user, you can change this however you se fit.
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Need to be logged in to add a like!", ErrorCodes.CannotDelete));
        }

        var torrent = await repository.GetAsync(new UserFileProjectionSpec(torrentId), cancellationToken); // First get the file entity from the database to find the location on the filesystem.

        if (torrent == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Cannot find the torrent!", ErrorCodes.EntityNotFound));
        }

        var existingLike = await repository.GetAsync(new LikeProjectionSpec(requestingUser.Id, torrentId), cancellationToken);

        if (existingLike != null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Conflict, "User already liked the torrent!", ErrorCodes.AlreadyExists));
        }

        await repository.AddAsync(new Like
        {
            UserId = requestingUser.Id,
            TorrentId = torrentId,
        });

        //await repository.AddAsync(new User
        //{
        //    Email = user.Email,
        //    Name = user.Name,
        //    Role = user.Role,
        //    Password = user.Password
        //}, cancellationToken); // A new entity is created and persisted in the database.

        await mailService.SendMail(torrent.User.Email, "Someone liked your torrent!", MailTemplates.LikedTorrentTemplate(torrent.User.Name, requestingUser.Name), true, "Torrent app", cancellationToken); // You can send a notification on the user email. Change the email if you want.

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<LikeCheckResponseDTO>> CheckLike(Guid torrentId, UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        if (requestingUser == null) // Verify who can add the user, you can change this however you se fit.
        {
            return ServiceResponse.FromError<LikeCheckResponseDTO>(new(HttpStatusCode.Forbidden, "Need to be logged in to add a like!", ErrorCodes.CannotDelete));
        }

        var torrent = await repository.GetAsync(new UserFileProjectionSpec(torrentId), cancellationToken); // First get the file entity from the database to find the location on the filesystem.

        if (torrent == null)
        {
            return ServiceResponse.FromError<LikeCheckResponseDTO>(new(HttpStatusCode.NotFound, "Cannot find the torrent!", ErrorCodes.EntityNotFound));
        }

        var existingLike = await repository.GetAsync(new LikeProjectionSpec(requestingUser.Id, torrentId), cancellationToken);

        return ServiceResponse<LikeCheckResponseDTO>.ForSuccess(new LikeCheckResponseDTO()
        {
            IsLiked = existingLike != null
        });
    }

    public async Task<ServiceResponse> DeleteLike(Guid torrentId, UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        if (requestingUser == null) // Verify who can add the user, you can change this however you se fit.
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Need to be logged in to delete a like!", ErrorCodes.CannotDelete));
        }

        var torrent = await repository.GetAsync(new UserFileProjectionSpec(torrentId), cancellationToken); // First get the file entity from the database to find the location on the filesystem.

        if (torrent == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Cannot find the torrent!", ErrorCodes.EntityNotFound));
        }

        var existingLike = await repository.GetAsync(new LikeProjectionSpec(requestingUser.Id, torrentId), cancellationToken);

        if (existingLike == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "User did not like the torrent!", ErrorCodes.EntityNotFound));
        }

        await repository.DeleteAsync<Like>(existingLike.Id, cancellationToken); // Delete the entity.

        return ServiceResponse.ForSuccess();
    }
}
