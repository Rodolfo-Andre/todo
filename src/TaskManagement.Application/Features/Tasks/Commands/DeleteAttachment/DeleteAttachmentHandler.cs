using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.DeleteAttachment;

public class DeleteAttachmentHandler : IRequestHandler<DeleteAttachmentCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IFileStorageService _fileStorageService;

    public DeleteAttachmentHandler(
        IUnitOfWork unitOfWork,
        IFileStorageService fileStorageService)
    {
        _unitOfWork = unitOfWork;
        _fileStorageService = fileStorageService;
    }

    public async Task<BaseResponse<bool>> Handle(
        DeleteAttachmentCommand request,
        CancellationToken cancellationToken)
    {
        var attachment = await _unitOfWork.TaskAttachments.GetByIdAsync(request.AttachmentId);
        if (attachment == null)
        {
            return new BaseResponse<bool>
            {
                Success = false,
                Message = "Attachment not found"
            };
        }

        await _fileStorageService.DeleteFileAsync(attachment.FilePath);
        _unitOfWork.TaskAttachments.Delete(attachment);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new BaseResponse<bool>
        {
            Success = true,
            Message = "Attachment deleted successfully",
            Data = true
        };
    }
}
