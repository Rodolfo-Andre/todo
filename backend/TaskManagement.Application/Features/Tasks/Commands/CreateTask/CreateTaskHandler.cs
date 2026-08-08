using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.CreateTask;

public class CreateTaskHandler : IRequestHandler<CreateTaskCommand, BaseResponse<Guid>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public CreateTaskHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<Guid>> Handle(CreateTaskCommand request, CancellationToken cancellationToken)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(request.ProjectId, cancellationToken);
        if (project == null)
        {
            return BaseResponse<Guid>.Failure("Project not found");
        }

        var userId = Guid.Parse(_currentUserService.UserId);

        // Get next order index for the project
        var existingTasks = await _unitOfWork.Tasks.FindAsync(
            t => t.ProjectId == request.ProjectId && !t.DeletedAt.HasValue,
            cancellationToken);
        var nextOrderIndex = existingTasks.Any() ? existingTasks.Max(t => t.OrderIndex) + 1 : 0;

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            ProjectId = request.ProjectId,
            AssignedToId = request.AssignedToId,
            CreatedById = userId,
            Status = 0, // Todo
            Priority = request.Priority,
            StoryPoints = request.StoryPoints,
            DueDate = request.DueDate,
            OrderIndex = nextOrderIndex,
            Tags = request.Tags != null ? string.Join(",", request.Tags) : null,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = _currentUserService.UserId
        };

        await _unitOfWork.Tasks.AddAsync(task, cancellationToken);

        // Create history entry
        var history = new TaskHistory
        {
            TaskId = task.Id,
            UserId = userId,
            Action = "Created",
            NewValue = task.Title,
            CreatedAt = DateTime.UtcNow
        };
        await _unitOfWork.TaskHistories.AddAsync(history, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return BaseResponse<Guid>.CreateSuccess(task.Id);
    }
}
