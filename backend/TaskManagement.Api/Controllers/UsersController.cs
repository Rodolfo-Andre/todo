using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Users.Commands.ChangeRole;
using TaskManagement.Application.Features.Users.Commands.DeleteUser;
using TaskManagement.Application.Features.Users.Commands.UpdateUser;
using TaskManagement.Application.Features.Users.Queries.GetUserById;
using TaskManagement.Application.Features.Users.Queries.GetUsers;
using TaskManagement.Shared.DTOs.Users;
using TaskManagement.Shared.Models;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<List<UserDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetUsers()
    {
        var result = await _mediator.Send(new GetUsersQuery());
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(BaseResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<UserDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(Guid id)
    {
        var result = await _mediator.Send(new GetUserByIdQuery { Id = id });

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        var command = new UpdateUserCommand
        {
            Id = id,
            FullName = request.FullName,
            Email = request.Email,
            AvatarUrl = request.AvatarUrl,
            IsActive = request.IsActive
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await _mediator.Send(new DeleteUserCommand { Id = id });

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("{id:guid}/role")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangeRole(Guid id, [FromBody] ChangeRoleRequest request)
    {
        var command = new ChangeRoleCommand
        {
            UserId = id,
            Role = request.Role
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
