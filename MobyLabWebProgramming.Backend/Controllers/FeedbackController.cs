using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MobyLabWebProgramming.Core.DataTransferObjects;
using MobyLabWebProgramming.Core.Entities;
using MobyLabWebProgramming.Core.Requests;
using MobyLabWebProgramming.Core.Responses;
using MobyLabWebProgramming.Infrastructure.Authorization;
using MobyLabWebProgramming.Infrastructure.Services.Implementations;
using MobyLabWebProgramming.Infrastructure.Services.Interfaces;
using System.ComponentModel.Design;

namespace MobyLabWebProgramming.Backend.Controllers;

/// <summary>
/// This is a controller example for CRUD operations on users.
/// Inject the required services through the constructor.
/// </summary>
[ApiController] // This attribute specifies for the framework to add functionality to the controller such as binding multipart/form-data.
[Route("api/[controller]/[action]")] // The Route attribute prefixes the routes/url paths with template provides as a string, the keywords between [] are used to automatically take the controller and method name.
public class FeedbackController(IUserService userService, IFeedbackService feedbackService) : AuthorizedController(userService) // Here we use the AuthorizedController as the base class because it derives ControllerBase and also has useful methods to retrieve user information.
{                                                                                         // Also, you may pass constructor parameters to a base class constructor and call as specific constructor from the base class.
    [Authorize]
    [HttpPost] // This attribute will make the controller respond to a HTTP POST request on the route /api/User/Add.
    public async Task<ActionResult<RequestResponse>> Add([FromBody] FeedbackAddDTO feedback)
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null ?
            FromServiceResponse(await feedbackService.AddFeedback(feedback.Satisfaction, feedback.WouldRecommend,  feedback.Text, currentUser.Result)) :
            ErrorMessageResult(currentUser.Error);
    }

    [Authorize]
    [HttpGet] // This attribute will make the controller respond to a HTTP GET request on the route /api/User/GetPage.
    public async Task<ActionResult<RequestResponse<PagedResponse<FeedbackDTO>>>> GetPage([FromQuery] PaginationQueryParams pagination) // The FromQuery attribute will bind the parameters matching the names of
    {
        var currentUser = await GetCurrentUser();

        return currentUser.Result != null ?
            FromServiceResponse(await feedbackService.GetFeedbacks(pagination)) :
            ErrorMessageResult<PagedResponse<FeedbackDTO>>(currentUser.Error);
    }
}
