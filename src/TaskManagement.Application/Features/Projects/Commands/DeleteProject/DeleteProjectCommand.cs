using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Commands.DeleteProject;

public class DeleteProjectCommand : IRequest<BaseResponse<bool>>
{
    public Guid Id { get; set; }
}
