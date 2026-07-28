using MediatR;
using Microsoft.AspNetCore.Http;
using TaskManagement.Shared.DTOs.Tasks;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.UploadAttachment;

public class UploadAttachmentCommand : IRequest<BaseResponse<TaskAttachmentDto>>
{
    public Guid TaskId { get; set; }
    public IFormFile File { get; set; } = null!;
}
