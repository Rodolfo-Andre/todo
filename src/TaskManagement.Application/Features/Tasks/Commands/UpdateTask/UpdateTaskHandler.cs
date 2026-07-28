using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.UpdateTask;

public class UpdateTaskHandler : IRequestHandler<UpdateTaskCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public UpdateTaskHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<bool>> Handle(UpdateTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
        {
            return BaseResponse<bool>.Failure("Task not found");
        }

        var userId = Guid.Parse(_currentUserService.UserId);
        var changes = new List<string>();

        if (task.Title != request.Title)
        {
            changes.Add($"Title: '{task.Title}' → '{request.Title}'");
            task.Title = request.Title;
        }

        if (task.Description != request.Description)
        {
            changes.Add("Description updated");
            task.Description = request.Description;
        }

        if (task.Priority != request.Priority)
        {
            var priorityNames = new[] { "Low", "Medium", "High", "Critical" };
            changes.Add($"Priority: {priorityNames[task.Priority]} → {priorityNames[request.Priority]}");
            task.Priority = request.Priority;
        }

        if (task.StoryPoints != request.StoryPoints)
        {
            changes.Add($"Story Points: {task.StoryPoints} → {request.StoryPoints}");
            task.StoryPoints = request.StoryPoints;
        }

        if (task.DueDate != request.DueDate)
        {
            changes.Add($"Due Date: {task.DueDate:yyyy-MM-dd} → {request.DueDate:yyyy-MM-dd}");
            task.DueDate = request.DueDate;
        }

        var newTags = request.Tags != null ? string.Join(",", request.Tags) : null;
        if (task.Tags != newTags)
        {
            changes.Add("Tags updated");
            task.Tags = newTags;
        }

        task.UpdatedAt = DateTime.UtcNow;
        task.UpdatedBy = _currentUserService.UserId;

        _unitOfWork.Tasks.Update(task);

        // Create history entry if there were changes
        if (changes.Any())
        {
            var history = new TaskHistory
            {
                TaskId = task.Id,
                UserId = userId,
                Action = "Updated",
                OldValue = string.Join("; ", changes),
                NewValue = null,
                CreatedAt = DateTime.UtcNow
            };
            await _unitOfWork.TaskHistories.AddAsync(history, cancellationToken);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return BaseResponse<bool>.CreateSuccess(true);
    }
}
