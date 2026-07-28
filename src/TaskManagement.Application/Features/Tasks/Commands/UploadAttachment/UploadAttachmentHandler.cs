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

    public UploadAttachmentHandler(
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService,
        IFileStorageService fileStorageService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _fileStorageService = fileStorageService;
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
                Message = "User not authenticated"
            };
        }

        var task = await _unitOfWork.Tasks.GetByIdAsync(request.TaskId);
        if (task == null)
        {
            return new BaseResponse<TaskAttachmentDto>
            {
                Success = false,
                Message = "Task not found"
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
            Message = "File uploaded successfully",
            Data = dto
        };
    }
}
