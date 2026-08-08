using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Commands.UpdateProject;

public class UpdateProjectCommand : IRequest<BaseResponse<bool>>
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int Status { get; set; }
}
