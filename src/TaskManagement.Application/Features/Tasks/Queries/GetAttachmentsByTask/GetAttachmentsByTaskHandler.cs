using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.DTOs.Tasks;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Queries.GetAttachmentsByTask;

public class GetAttachmentsByTaskHandler : IRequestHandler<GetAttachmentsByTaskQuery, BaseResponse<List<TaskAttachmentDto>>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetAttachmentsByTaskHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseResponse<List<TaskAttachmentDto>>> Handle(
        GetAttachmentsByTaskQuery request,
        CancellationToken cancellationToken)
    {
        var attachments = await _unitOfWork.TaskAttachments.FindAsync(
            a => a.TaskId == request.TaskId && a.DeletedAt == null);

        var dtoList = attachments.Select(a => new TaskAttachmentDto
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

        return new BaseResponse<List<TaskAttachmentDto>>
        {
            Success = true,
            Message = "Attachments retrieved successfully",
            Data = dtoList
        };
    }
}
