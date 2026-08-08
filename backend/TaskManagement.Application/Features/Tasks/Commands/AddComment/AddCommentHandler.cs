using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.AddComment;

public class AddCommentHandler : IRequestHandler<AddCommentCommand, BaseResponse<Guid>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILocalizer _localizer;

    public AddCommentHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService, ILocalizer localizer)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<Guid>> Handle(AddCommentCommand request, CancellationToken cancellationToken)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(request.TaskId, cancellationToken);
        if (task == null)
        {
            return BaseResponse<Guid>.Failure(_localizer.Get("TaskNotFound"));
        }

        var userId = Guid.Parse(_currentUserService.UserId);

        var comment = new TaskComment
        {
            TaskId = request.TaskId,
            UserId = userId,
            Content = request.Content,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.TaskComments.AddAsync(comment, cancellationToken);

        // Create history entry
        var history = new TaskHistory
        {
            TaskId = task.Id,
            UserId = userId,
            Action = "Commented",
            NewValue = request.Content.Length > 100 ? request.Content.Substring(0, 100) + "..." : request.Content,
            CreatedAt = DateTime.UtcNow
        };
        await _unitOfWork.TaskHistories.AddAsync(history, cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return BaseResponse<Guid>.CreateSuccess(comment.Id);
    }
}
