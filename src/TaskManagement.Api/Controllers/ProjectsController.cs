using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Projects.Commands.AddMember;
using TaskManagement.Application.Features.Projects.Commands.CreateProject;
using TaskManagement.Application.Features.Projects.Commands.DeleteProject;
using TaskManagement.Application.Features.Projects.Commands.RemoveMember;
using TaskManagement.Application.Features.Projects.Commands.UpdateProject;
using TaskManagement.Application.Features.Projects.Queries.GetProjectById;
using TaskManagement.Application.Features.Projects.Queries.GetProjectMembers;
using TaskManagement.Application.Features.Projects.Queries.GetProjects;
using TaskManagement.Shared.DTOs.Projects;
using TaskManagement.Shared.Models;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProjectsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    [ProducesResponseType(typeof(BaseResponse<List<ProjectDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProjects()
    {
        var result = await _mediator.Send(new GetProjectsQuery());
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(BaseResponse<ProjectDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<ProjectDto>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProjectById(Guid id)
    {
        var result = await _mediator.Send(new GetProjectByIdQuery { Id = id });

        if (!result.Success)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(BaseResponse<Guid>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<Guid>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectRequest request)
    {
        var command = new CreateProjectCommand
        {
            Name = request.Name,
            Description = request.Description,
            Key = request.Key
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProject(Guid id, [FromBody] UpdateProjectRequest request)
    {
        var command = new UpdateProjectCommand
        {
            Id = id,
            Name = request.Name,
            Description = request.Description,
            Status = request.Status
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        var result = await _mediator.Send(new DeleteProjectCommand { Id = id });

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("{id:guid}/members")]
    [ProducesResponseType(typeof(BaseResponse<List<ProjectMemberDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProjectMembers(Guid id)
    {
        var result = await _mediator.Send(new GetProjectMembersQuery { ProjectId = id });
        return Ok(result);
    }

    [HttpPost("{id:guid}/members")]
    [Authorize(Roles = "Admin,ProjectManager")]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddMember(Guid id, [FromBody] AddMemberRequest request)
    {
        var command = new AddMemberCommand
        {
            ProjectId = id,
            UserId = request.UserId,
            ProjectRole = request.ProjectRole
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id:guid}/members/{userId:guid}")]
    [Authorize(Roles = "Admin,ProjectManager")]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseResponse<bool>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RemoveMember(Guid id, Guid userId)
    {
        var result = await _mediator.Send(new RemoveMemberCommand
        {
            ProjectId = id,
            UserId = userId
        });

        if (!result.Success)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
