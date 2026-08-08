using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.AddComment;

public class AddCommentCommand : IRequest<BaseResponse<Guid>>
{
    public Guid TaskId { get; set; }
    public string Content { get; set; } = string.Empty;
}
