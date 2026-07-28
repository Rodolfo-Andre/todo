using MediatR;
using TaskManagement.Shared.DTOs.Projects;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Queries.GetProjectById;

public class GetProjectByIdQuery : IRequest<BaseResponse<ProjectDto>>
{
    public Guid Id { get; set; }
}
