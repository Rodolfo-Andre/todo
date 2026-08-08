using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.DTOs.Tasks;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Queries.GetMyTasks;

public class GetMyTasksHandler : IRequestHandler<GetMyTasksQuery, BaseResponse<List<TaskDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public GetMyTasksHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<List<TaskDto>>> Handle(GetMyTasksQuery request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId);

        var query = (await _unitOfWork.Tasks.FindAsync(
            t => t.AssignedToId == userId && !t.DeletedAt.HasValue,
            cancellationToken)).AsQueryable();

        if (request.Status.HasValue)
        {
            query = query.Where(t => t.Status == request.Status.Value);
        }

        if (request.Priority.HasValue)
        {
            query = query.Where(t => t.Priority == request.Priority.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var searchLower = request.Search.ToLower();
            query = query.Where(t => t.Title.ToLower().Contains(searchLower) ||
                                     (t.Description != null && t.Description.ToLower().Contains(searchLower)));
        }

        var tasks = query.OrderByDescending(t => t.CreatedAt).ToList();

        var taskDtos = new List<TaskDto>();
        foreach (var task in tasks)
        {
            var project = await _unitOfWork.Projects.GetByIdAsync(task.ProjectId, cancellationToken);
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
                ProjectName = project?.Name ?? "Unknown",
                ProjectKey = project?.Key ?? "Unknown",
                AssignedToId = task.AssignedToId,
                AssignedToName = _currentUserService.UserId,
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
