using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.ReorderTask;

public class ReorderTaskHandler : IRequestHandler<ReorderTaskCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILocalizer _localizer;

    public ReorderTaskHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService, ILocalizer localizer)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<bool>> Handle(ReorderTaskCommand request, CancellationToken cancellationToken)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
        {
            return BaseResponse<bool>.Failure(_localizer.Get("TaskNotFound"));
        }

        var userId = Guid.Parse(_currentUserService.UserId);
        var statusNames = new[] { "Todo", "In Progress", "In Review", "Done", "Cancelled" };

        task.OrderIndex = request.OrderIndex;

        if (request.NewStatus.HasValue && task.Status != request.NewStatus.Value)
        {
            var oldStatus = task.Status;
            task.Status = request.NewStatus.Value;

            var history = new TaskHistory
            {
                TaskId = task.Id,
                UserId = userId,
                Action = "StatusChanged",
                OldValue = statusNames[oldStatus],
                NewValue = statusNames[request.NewStatus.Value],
                CreatedAt = DateTime.UtcNow
            };
            await _unitOfWork.TaskHistories.AddAsync(history, cancellationToken);
        }

        task.UpdatedAt = DateTime.UtcNow;
        task.UpdatedBy = _currentUserService.UserId;

        _unitOfWork.Tasks.Update(task);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return BaseResponse<bool>.CreateSuccess(true);
    }
}
