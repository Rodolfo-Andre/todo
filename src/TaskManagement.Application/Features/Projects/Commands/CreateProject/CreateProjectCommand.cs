using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Commands.CreateProject;

public class CreateProjectCommand : IRequest<BaseResponse<Guid>>
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Key { get; set; } = string.Empty;
}
