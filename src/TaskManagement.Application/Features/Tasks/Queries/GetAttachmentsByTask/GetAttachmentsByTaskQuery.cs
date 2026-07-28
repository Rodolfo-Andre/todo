using MediatR;
using TaskManagement.Shared.DTOs.Tasks;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Queries.GetAttachmentsByTask;

public class GetAttachmentsByTaskQuery : IRequest<BaseResponse<List<TaskAttachmentDto>>>
{
    public Guid TaskId { get; set; }
}
