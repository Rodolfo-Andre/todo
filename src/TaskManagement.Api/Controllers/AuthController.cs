using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Auth.Commands.Login;
using TaskManagement.Application.Features.Auth.Commands.Logout;
using TaskManagement.Application.Features.Auth.Commands.RefreshToken;
using TaskManagement.Application.Features.Auth.Commands.Register;
using TaskManagement.Application.Features.Auth.Queries.GetCurrentUser;
using TaskManagement.Shared.DTOs.Auth;
using TaskManagement.Shared.Models;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(BaseResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<AuthResponse>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("register")]
    [ProducesResponseType(typeof(BaseResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<AuthResponse>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("refresh")]
    [ProducesResponseType(typeof(BaseResponse<AuthResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<AuthResponse>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenCommand command)
    {
        var result = await _mediator.Send(command);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost("logout")]
    [Authorize]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Logout()
    {
        var result = await _mediator.Send(new LogoutCommand());
        return Ok(result);
    }

    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(BaseResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        var result = await _mediator.Send(new GetCurrentUserQuery());
        return Ok(result);
    }
}
