using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Tasks.Commands.ReorderTask;

public class ReorderTaskCommand : IRequest<BaseResponse<bool>>
{
    public Guid Id { get; set; }
    public int OrderIndex { get; set; }
    public int? NewStatus { get; set; }
}
