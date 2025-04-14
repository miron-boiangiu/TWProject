using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;

namespace MobyLabWebProgramming.Backend.Controllers;

/// <summary>
/// This is a controller example for CRUD operations on users.
/// Inject the required services through the constructor.
/// </summary>
[ApiController] // This attribute specifies for the framework to add functionality to the controller such as binding multipart/form-data.
[Route("api/[controller]/[action]")] // The Route attribute prefixes the routes/url paths with template provides as a string, the keywords between [] are used to automatically take the controller and method name.
public class InvitationController(IUserService userService, IInvitationService invitationService) : AuthorizedController(userService) // Here we use the AuthorizedController as the base class because it derives ControllerBase and also has useful methods to retrieve user information.
{                                                                                         // Also, you may pass constructor parameters to a base class constructor and call as specific constructor from the base class.
    [Authorize]
    [HttpGet] // This attribute will make the controller respond to a HTTP POST request on the route /api/User/Add.
    public async Task<ActionResult<RequestResponse<InvitationDTO>>> Generate()
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null ?
            FromServiceResponse(await invitationService.Generate(currentUser.Result)) :
            ErrorMessageResult<InvitationDTO>(currentUser.Error);
    }

    [Authorize]
    [HttpGet("{invitationId:guid}")] // This attribute will make the controller respond to a HTTP POST request on the route /api/User/Add.
    public async Task<ActionResult<RequestResponse<InvitationDTO>>> Get(Guid invitationId)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null ?
            FromServiceResponse(await invitationService.Get(invitationId, currentUser.Result)) :
            ErrorMessageResult<InvitationDTO>(currentUser.Error);
    }
}
