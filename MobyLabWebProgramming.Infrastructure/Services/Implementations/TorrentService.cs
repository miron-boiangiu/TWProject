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
using System.Net;

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

/// <summary>
/// Inject the required services through the constructor.
/// </summary>
public class TorrentService(IRepository<WebAppDatabaseContext> repository, IFileRepository fileRepository) : ITorrentService
{
    /// <summary>
    /// This static method creates the path for a user to where it has to store the files, each user should have an own folder.
    /// </summary>
    private static string GetFileDirectory(Guid userId) => Path.Join(userId.ToString(), ITorrentService.UserFilesDirectory);


    public async Task<ServiceResponse<PagedResponse<TorrentDTO>>> GetTorrentFiles(PaginationSearchQueryParams pagination, CancellationToken cancellationToken = default)
    {
        var result = await repository.PageAsync(pagination, new UserFileProjectionSpec(pagination.Search), cancellationToken);

        return ServiceResponse.ForSuccess(result);
    }

    public async Task<ServiceResponse> SaveTorrentFile(TorrentAddDTO file, UserDTO requestingUser, CancellationToken cancellationToken = default)
    {
        var fileName = fileRepository.SaveFile(file.File, GetFileDirectory(requestingUser.Id)); // First save the file on the filesystem.

        if (fileName.Result == null) // If not successful respond with the error.
        {
            return fileName.ToResponse();
        }

        await repository.AddAsync(new Torrent
        {
            Name = file.File.FileName,
            Description = file.Description,
            Path = fileName.Result,
            UserId = requestingUser.Id
        }, cancellationToken); // When the file is saved on the filesystem save the returned file path in the database to identify the file.

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<FileDTO>> GetTorrentFileDownload(Guid id, CancellationToken cancellationToken = default) // If not successful respond with the error.
    {
        var userFile = await repository.GetAsync<Torrent>(id, cancellationToken); // First get the file entity from the database to find the location on the filesystem.

        return userFile != null ? 
            fileRepository.GetFile(Path.Join(GetFileDirectory(userFile.UserId), userFile.Path), userFile.Name) : 
            ServiceResponse.FromError<FileDTO>(new(HttpStatusCode.NotFound, "File entry not found!", ErrorCodes.EntityNotFound));
    }

    public async Task<ServiceResponse<TorrentDTO>> GetTorrent(Guid id, UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        var torrent = await repository.GetAsync(new UserFileProjectionSpec(id), cancellationToken); // First get the file entity from the database to find the location on the filesystem.

        if (torrent == null)
        {
            return ServiceResponse.FromError<TorrentDTO>(new(HttpStatusCode.NotFound, "Torrent does not exist.", ErrorCodes.EntityNotFound));
        }

        return ServiceResponse.ForSuccess<TorrentDTO>(torrent);
    }

    public async Task<ServiceResponse> DeleteTorrent(Guid id, UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        var torrentDTO = await repository.GetAsync(new UserFileProjectionSpec(id), cancellationToken);
        var torrent = await repository.GetAsync<Torrent>(id, cancellationToken); // First get the file entity from the database to find the location on the filesystem.

        if (torrent == null || torrentDTO == null)
        {
            return ServiceResponse.FromError(new(HttpStatusCode.NotFound, "Torrent does not exist.", ErrorCodes.EntityNotFound));
        }

        if (requestingUser != null && requestingUser.Role != UserRoleEnum.Admin && requestingUser.Id != torrentDTO.User.Id) // Verify who can add the user, you can change this however you se fit.
        {
            return ServiceResponse.FromError(new(HttpStatusCode.Forbidden, "Only the admin or the own user can delete the torrent!", ErrorCodes.CannotDelete));
        }

        await repository.DeleteAsync<Torrent>(id, cancellationToken); // Delete the entity.

        fileRepository.DeleteFile( Path.Join(GetFileDirectory(torrent.UserId), torrent.Path) );

        return ServiceResponse.ForSuccess();
    }
}
