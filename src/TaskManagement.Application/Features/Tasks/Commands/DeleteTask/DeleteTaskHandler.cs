using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.DeleteTask;

public class DeleteTaskHandler : IRequestHandler<DeleteTaskCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public DeleteTaskHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<bool>> Handle(DeleteTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
        {
            return BaseResponse<bool>.Failure("Task not found");
        }

        var userId = Guid.Parse(_currentUserService.UserId);

        // Soft delete
        task.DeletedAt = DateTime.UtcNow;
        task.DeletedBy = _currentUserService.UserId;
        task.UpdatedAt = DateTime.UtcNow;
        task.UpdatedBy = _currentUserService.UserId;

        _unitOfWork.Tasks.Update(task);

        // Create history entry
        var history = new TaskHistory
        {
            TaskId = task.Id,
            UserId = userId,
            Action = "Deleted",
            OldValue = task.Title,
            CreatedAt = DateTime.UtcNow
        };
        await _unitOfWork.TaskHistories.AddAsync(history, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return BaseResponse<bool>.CreateSuccess(true);
    }
}
