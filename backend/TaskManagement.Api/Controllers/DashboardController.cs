using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Dashboard.GetDashboardData;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IMediator _mediator;

    public DashboardController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboardData()
    {
        var query = new GetDashboardDataQuery();
        var result = await _mediator.Send(query);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }
}
