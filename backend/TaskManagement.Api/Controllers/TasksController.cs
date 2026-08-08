using MediatR;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.Application.Features.Tasks.Commands.AddComment;
using TaskManagement.Application.Features.Tasks.Commands.AssignTask;
using TaskManagement.Application.Features.Tasks.Commands.ChangeStatus;
using TaskManagement.Application.Features.Tasks.Commands.CreateTask;
using TaskManagement.Application.Features.Tasks.Commands.DeleteAttachment;
using TaskManagement.Application.Features.Tasks.Commands.DeleteTask;
using TaskManagement.Application.Features.Tasks.Commands.ReorderTask;
using TaskManagement.Application.Features.Tasks.Commands.UpdateTask;
using TaskManagement.Application.Features.Tasks.Commands.UploadAttachment;
using TaskManagement.Application.Features.Tasks.Queries.GetAttachmentsByTask;
using TaskManagement.Application.Features.Tasks.Queries.GetMyTasks;
using TaskManagement.Application.Features.Tasks.Queries.GetTaskById;
using TaskManagement.Application.Features.Tasks.Queries.GetTasksByProject;
using TaskManagement.Shared.DTOs.Tasks;

namespace TaskManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly IMediator _mediator;

    public TasksController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask([FromBody] CreateTaskRequest request)
    {
        var command = new CreateTaskCommand
        {
            Title = request.Title,
            Description = request.Description,
            ProjectId = request.ProjectId,
            AssignedToId = request.AssignedToId,
            Priority = request.Priority,
            StoryPoints = request.StoryPoints,
            DueDate = request.DueDate,
            Tags = request.Tags
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetTasksByProject(Guid projectId, [FromQuery] int? status, [FromQuery] int? priority, [FromQuery] string? search, [FromQuery] Guid? assignedToId)
    {
        var query = new GetTasksByProjectQuery
        {
            ProjectId = projectId,
            Status = status,
            Priority = priority,
            Search = search,
            AssignedToId = assignedToId
        };

        var result = await _mediator.Send(query);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyTasks([FromQuery] int? status, [FromQuery] int? priority, [FromQuery] string? search)
    {
        var query = new GetMyTasksQuery
        {
            Status = status,
            Priority = priority,
            Search = search
        };

        var result = await _mediator.Send(query);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTaskById(Guid id)
    {
        var query = new GetTaskByIdQuery { Id = id };
        var result = await _mediator.Send(query);

        if (!result.Success)
            return NotFound(result);

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(Guid id, [FromBody] UpdateTaskRequest request)
    {
        var command = new UpdateTaskCommand
        {
            Id = id,
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            StoryPoints = request.StoryPoints,
            DueDate = request.DueDate,
            Tags = request.Tags
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var command = new DeleteTaskCommand { Id = id };
        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ChangeStatus(Guid id, [FromBody] ChangeStatusRequest request)
    {
        var command = new ChangeStatusCommand
        {
            Id = id,
            Status = request.Status
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPatch("{id}/assign")]
    public async Task<IActionResult> AssignTask(Guid id, [FromBody] AssignTaskRequest request)
    {
        var command = new AssignTaskCommand
        {
            Id = id,
            AssignedToId = request.AssignedToId
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPatch("{id}/reorder")]
    public async Task<IActionResult> ReorderTask(Guid id, [FromBody] ReorderTaskRequest request)
    {
        var command = new ReorderTaskCommand
        {
            Id = id,
            OrderIndex = request.OrderIndex,
            NewStatus = request.NewStatus
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("{taskId}/comments")]
    public async Task<IActionResult> AddComment(Guid taskId, [FromBody] AddCommentRequest request)
    {
        var command = new AddCommentCommand
        {
            TaskId = taskId,
            Content = request.Content
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpPost("{taskId}/attachments")]
    public async Task<IActionResult> UploadAttachment(Guid taskId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { Success = false, Message = "No file uploaded" });

        var command = new UploadAttachmentCommand
        {
            TaskId = taskId,
            File = file
        };

        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpGet("{taskId}/attachments")]
    public async Task<IActionResult> GetAttachments(Guid taskId)
    {
        var query = new GetAttachmentsByTaskQuery { TaskId = taskId };
        var result = await _mediator.Send(query);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }

    [HttpDelete("attachments/{attachmentId}")]
    public async Task<IActionResult> DeleteAttachment(Guid attachmentId)
    {
        var command = new DeleteAttachmentCommand { AttachmentId = attachmentId };
        var result = await _mediator.Send(command);

        if (!result.Success)
            return BadRequest(result);

        return Ok(result);
    }
}
