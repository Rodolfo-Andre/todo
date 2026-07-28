using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.DeleteAttachment;

public class DeleteAttachmentCommand : IRequest<BaseResponse<bool>>
{
    public Guid AttachmentId { get; set; }
}
