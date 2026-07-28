using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.DTOs.Tasks;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Queries.GetTasksByProject;

public class GetTasksByProjectHandler : IRequestHandler<GetTasksByProjectQuery, BaseResponse<List<TaskDto>>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetTasksByProjectHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseResponse<List<TaskDto>>> Handle(GetTasksByProjectQuery request, CancellationToken cancellationToken)
    {
        var query = (await _unitOfWork.Tasks.FindAsync(
            t => t.ProjectId == request.ProjectId && !t.DeletedAt.HasValue,
            cancellationToken)).AsQueryable();

        if (request.Status.HasValue)
        {
            query = query.Where(t => t.Status == request.Status.Value);
        }

        if (request.Priority.HasValue)
        {
            query = query.Where(t => t.Priority == request.Priority.Value);
        }

        if (request.AssignedToId.HasValue)
        {
            query = query.Where(t => t.AssignedToId == request.AssignedToId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLower();
            query = query.Where(t => t.Title.ToLower().Contains(searchLower) ||
                                     (t.Description != null && t.Description.ToLower().Contains(searchLower)));
        }

        var tasks = query.OrderBy(t => t.Status).ThenBy(t => t.OrderIndex).ToList();

        var taskDtos = new List<TaskDto>();
        foreach (var task in tasks)
        {
            var assignedUser = task.AssignedToId.HasValue
                ? await _unitOfWork.Users.GetByIdAsync(task.AssignedToId.Value, cancellationToken)
                : null;

            var createdByUser = await _unitOfWork.Users.GetByIdAsync(task.CreatedById, cancellationToken);

            var commentCount = await _unitOfWork.TaskComments.CountAsync(
                c => c.TaskId == task.Id && !c.DeletedAt.HasValue, cancellationToken);

            var attachmentCount = await _unitOfWork.TaskAttachments.CountAsync(
                a => a.TaskId == task.Id && !a.DeletedAt.HasValue, cancellationToken);

            taskDtos.Add(new TaskDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                ProjectId = task.ProjectId,
                AssignedToId = task.AssignedToId,
                AssignedToName = assignedUser?.FullName ?? assignedUser?.UserName,
                CreatedById = task.CreatedById,
                CreatedByName = createdByUser?.FullName ?? createdByUser?.UserName ?? "Unknown",
                Status = task.Status,
                Priority = task.Priority,
                StoryPoints = task.StoryPoints,
                DueDate = task.DueDate,
                OrderIndex = task.OrderIndex,
                Tags = task.Tags,
                CommentCount = commentCount,
                AttachmentCount = attachmentCount,
                CreatedAt = task.CreatedAt
            });
        }

        return BaseResponse<List<TaskDto>>.CreateSuccess(taskDtos);
    }
}
