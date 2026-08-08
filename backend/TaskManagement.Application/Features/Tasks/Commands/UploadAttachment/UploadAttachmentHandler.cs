using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Tasks;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.UploadAttachment;

public class UploadAttachmentHandler : IRequestHandler<UploadAttachmentCommand, BaseResponse<TaskAttachmentDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly IFileStorageService _fileStorageService;
    private readonly ILocalizer _localizer;

    public UploadAttachmentHandler(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService,
        IFileStorageService fileStorageService,
        ILocalizer localizer)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _fileStorageService = fileStorageService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<TaskAttachmentDto>> Handle(
        UploadAttachmentCommand request,
        CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            return new BaseResponse<TaskAttachmentDto>
            {
                Success = false,
                Message = _localizer.Get("UserNotAuthenticated")
            };
        }

        var task = await _unitOfWork.Tasks.GetByIdAsync(request.TaskId);
        if (task == null)
        {
            return new BaseResponse<TaskAttachmentDto>
            {
                Success = false,
                Message = _localizer.Get("TaskNotFound")
            };
        }

        var subDirectory = $"tasks/{request.TaskId}";
        var filePath = await _fileStorageService.UploadFileAsync(request.File, subDirectory);

        var attachment = new TaskAttachment
        {
            TaskId = request.TaskId,
            UserId = Guid.Parse(userId),
            FileName = request.File.FileName,
            FilePath = filePath,
            FileSize = request.File.Length,
            ContentType = request.File.ContentType
        };

        await _unitOfWork.TaskAttachments.AddAsync(attachment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var dto = new TaskAttachmentDto
        {
            Id = attachment.Id,
            TaskId = attachment.TaskId,
            UserId = attachment.UserId,
            FileName = attachment.FileName,
            FilePath = attachment.FilePath,
            FileSize = attachment.FileSize,
            ContentType = attachment.ContentType,
            CreatedAt = attachment.CreatedAt
        };

        return new BaseResponse<TaskAttachmentDto>
        {
            Success = true,
            Message = _localizer.Get("AttachmentUploaded"),
            Data = dto
        };
    }
}
