using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;

namespace MobyLabWebProgramming.Infrastructure.Services.Interfaces;

/// <summary>
/// This service will be uses to mange user information.
/// As most routes and business logic will need to know what user is currently using the backend this service will be the most used.
/// </summary>
public interface ICommentService
{
    public Task<ServiceResponse> AddComment(Guid torrentId, string text, UserDTO? requestingUser = null, CancellationToken cancellationToken = default);
    /// <summary>
    /// UpdateUser updates an user and verifies if requesting user has permissions to update it, if the user is his own then that should be allowed.
    /// If the requesting user is null then no verification is performed as it indicates that the application.
    /// </summary>
    public Task<ServiceResponse> DeleteComment(Guid id, UserDTO? requestingUser = null, CancellationToken cancellationToken = default);

    public Task<ServiceResponse> UpdateComment(CommentUpdateDTO comment, UserDTO? requestingUser = null, CancellationToken cancellationToken = default);

    public Task<ServiceResponse<PagedResponse<CommentDTO>>> GetComments(CommentPaginationSearchQueryParams pagination, CancellationToken cancellationToken = default);
}
