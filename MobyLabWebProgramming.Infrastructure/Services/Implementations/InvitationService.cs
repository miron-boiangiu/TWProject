using System.Net;
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

namespace MobyLabWebProgramming.Infrastructure.Services.Implementations;

/// <summary>
/// Inject the required services through the constructor.
/// </summary>
public class InvitationService(IRepository<WebAppDatabaseContext> repository) : IInvitationService
{
    public async Task<ServiceResponse<InvitationDTO>> Generate(UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        if (requestingUser == null) // Verify who can add the user, you can change this however you se fit.
        {
            return ServiceResponse.FromError<InvitationDTO>(new(HttpStatusCode.Forbidden, "Need to be logged in to generate an invitation!", ErrorCodes.CannotAdd));
        }

        if (requestingUser.Role != UserRoleEnum.Admin)
        {
            return ServiceResponse.FromError<InvitationDTO>(new(HttpStatusCode.Forbidden, "Only admins are allowed to generate an invitation!", ErrorCodes.CannotAdd));

        }

        var newInvitation = await repository.AddAsync(new Invitation()
        {
            GeneratedByUserId = requestingUser.Id,
        }, cancellationToken);

        if (newInvitation == null)
        {
            return ServiceResponse.FromError<InvitationDTO>(new(HttpStatusCode.InternalServerError, "Failed to add new invitation to DB.", ErrorCodes.CannotAdd));
        }

        var invitationDTO = await repository.GetAsync(new InvitationProjectionSpec(newInvitation.Id), cancellationToken);

        if (invitationDTO == null)
        {
            return ServiceResponse.FromError<InvitationDTO>(new(HttpStatusCode.NotFound, "Invitation not found!", ErrorCodes.EntityNotFound));
        }

        return ServiceResponse.ForSuccess<InvitationDTO>(invitationDTO);
    }

    public async Task<ServiceResponse<InvitationDTO>> Get(Guid id, UserDTO? requestingUser = null, CancellationToken cancellationToken = default)
    {
        if (requestingUser == null) // Verify who can add the user, you can change this however you se fit.
        {
            return ServiceResponse.FromError<InvitationDTO>(new(HttpStatusCode.Forbidden, "Need to be logged in to get an invitation!", ErrorCodes.CannotAdd));
        }

        if (requestingUser.Role != UserRoleEnum.Admin)
        {
            return ServiceResponse.FromError<InvitationDTO>(new(HttpStatusCode.Forbidden, "Only admins are allowed to get an invitation!", ErrorCodes.CannotAdd));

        }

        var invitationDTO = await repository.GetAsync(new InvitationProjectionSpec(id), cancellationToken);

        if (invitationDTO == null)
        {
            return ServiceResponse.FromError<InvitationDTO>(new(HttpStatusCode.NotFound, "Invitation not found!", ErrorCodes.EntityNotFound));
        }

        return ServiceResponse.ForSuccess<InvitationDTO>(invitationDTO);
    }

    public async Task<ServiceResponse> UncheckedMarkAsUsed(Guid id, UserDTO createdUser, CancellationToken cancellationToken = default)
    {
        var invitationDTO = await repository.GetAsync(new InvitationProjectionSpec(id), cancellationToken);

        if (invitationDTO == null)
        {
            return ServiceResponse.FromError<InvitationDTO>(new(HttpStatusCode.NotFound, "Invitation not found!", ErrorCodes.EntityNotFound));
        }

        await repository.UpdateAsync(new Invitation()
        {
            Id = invitationDTO.Id,
            GeneratedByUserId = invitationDTO.GeneratedByUser.Id,
            CreatedUserId = createdUser.Id,
        }, cancellationToken);

        return ServiceResponse.ForSuccess();
    }

    public async Task<ServiceResponse<InvitationDTO>> UncheckedGet(Guid id, CancellationToken cancellationToken = default)
    {
        var invitationDTO = await repository.GetAsync(new InvitationProjectionSpec(id), cancellationToken);

        if (invitationDTO == null)
        {
            return ServiceResponse.FromError<InvitationDTO>(new(HttpStatusCode.NotFound, "Invitation not found!", ErrorCodes.EntityNotFound));
        }

        return ServiceResponse.ForSuccess<InvitationDTO>(invitationDTO);
    }
}
