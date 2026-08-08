using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.DTOs.Tasks;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Queries.GetTaskById;

public class GetTaskByIdHandler : IRequestHandler<GetTaskByIdQuery, BaseResponse<TaskDetailDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILocalizer _localizer;

    public GetTaskByIdHandler(IUnitOfWork unitOfWork, ILocalizer localizer)
    {
        _unitOfWork = unitOfWork;
        _localizer = localizer;
    }

    public async Task<BaseResponse<TaskDetailDto>> Handle(GetTaskByIdQuery request, CancellationToken cancellationToken)
    {
        var task = await _unitOfWork.Tasks.GetByIdAsync(request.Id, cancellationToken);
        if (task == null)
        {
            return BaseResponse<TaskDetailDto>.Failure(_localizer.Get("TaskNotFound"));
        }

        var project = await _unitOfWork.Projects.GetByIdAsync(task.ProjectId, cancellationToken);
        var assignedUser = task.AssignedToId.HasValue
            ? await _unitOfWork.Users.GetByIdAsync(task.AssignedToId.Value, cancellationToken)
            : null;
        var createdByUser = await _unitOfWork.Users.GetByIdAsync(task.CreatedById, cancellationToken);

        // Get comments
        var comments = await _unitOfWork.TaskComments.FindAsync(
            c => c.TaskId == task.Id && !c.DeletedAt.HasValue, cancellationToken);

        var commentDtos = new List<TaskCommentDto>();
        foreach (var comment in comments)
        {
            var commentUser = await _unitOfWork.Users.GetByIdAsync(comment.UserId, cancellationToken);
            commentDtos.Add(new TaskCommentDto
            {
                Id = comment.Id,
                TaskId = comment.TaskId,
                UserId = comment.UserId,
                UserName = commentUser?.UserName ?? "Unknown",
                UserFullName = commentUser?.FullName,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt
            });
        }

        // Get attachments
        var attachments = await _unitOfWork.TaskAttachments.FindAsync(
            a => a.TaskId == task.Id && !a.DeletedAt.HasValue, cancellationToken);

        var attachmentDtos = attachments.Select(a => new TaskAttachmentDto
        {
            Id = a.Id,
            TaskId = a.TaskId,
            UserId = a.UserId,
            FileName = a.FileName,
            FilePath = a.FilePath,
            FileSize = a.FileSize,
            ContentType = a.ContentType,
            CreatedAt = a.CreatedAt
        }).ToList();

        // Get histories
        var histories = await _unitOfWork.TaskHistories.FindAsync(
            h => h.TaskId == task.Id, cancellationToken);

        var historyDtos = new List<TaskHistoryDto>();
        foreach (var history in histories.OrderByDescending(h => h.CreatedAt))
        {
            var historyUser = await _unitOfWork.Users.GetByIdAsync(history.UserId, cancellationToken);
            historyDtos.Add(new TaskHistoryDto
            {
                Id = history.Id,
                TaskId = history.TaskId,
                UserId = history.UserId,
                UserName = historyUser?.FullName ?? historyUser?.UserName ?? "Unknown",
                Action = history.Action,
                OldValue = history.OldValue,
                NewValue = history.NewValue,
                CreatedAt = history.CreatedAt
            });
        }

        var dto = new TaskDetailDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            ProjectId = task.ProjectId,
            ProjectName = project?.Name ?? "Unknown",
            ProjectKey = project?.Key ?? "Unknown",
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
            CommentCount = commentDtos.Count,
            AttachmentCount = attachmentDtos.Count,
            CreatedAt = task.CreatedAt,
            Comments = commentDtos,
            Attachments = attachmentDtos,
            Histories = historyDtos
        };

        return BaseResponse<TaskDetailDto>.CreateSuccess(dto);
    }
}
