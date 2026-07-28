using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.AssignTask;

public class AssignTaskHandler : IRequestHandler<AssignTaskCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public AssignTaskHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<bool>> Handle(AssignTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
        {
            return BaseResponse<bool>.Failure("Task not found");
        }

        var userId = Guid.Parse(_currentUserService.UserId);
        var oldAssignedTo = task.AssignedToId;

        task.AssignedToId = request.AssignedToId;
        task.UpdatedAt = DateTime.UtcNow;
        task.UpdatedBy = _currentUserService.UserId;

        _unitOfWork.Tasks.Update(task);

        // Create history entry
        string? oldValue = null;
        string? newValue = null;

        if (oldAssignedTo.HasValue)
        {
            var oldUser = await _unitOfWork.Users.GetByIdAsync(oldAssignedTo.Value, cancellationToken);
            oldValue = oldUser?.FullName ?? oldUser?.UserName ?? "Unknown";
        }

        if (request.AssignedToId.HasValue)
        {
            var newUser = await _unitOfWork.Users.GetByIdAsync(request.AssignedToId.Value, cancellationToken);
            newValue = newUser?.FullName ?? newUser?.UserName ?? "Unknown";
        }

        var history = new TaskHistory
        {
            TaskId = task.Id,
            UserId = userId,
            Action = "Assigned",
            OldValue = oldValue ?? "Unassigned",
            NewValue = newValue ?? "Unassigned",
            CreatedAt = DateTime.UtcNow
        };
        await _unitOfWork.TaskHistories.AddAsync(history, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return BaseResponse<bool>.CreateSuccess(true);
    }
}
