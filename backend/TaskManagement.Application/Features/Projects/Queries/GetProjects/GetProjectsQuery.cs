using MediatR;
using TaskManagement.Shared.DTOs.Projects;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Queries.GetProjects;

public class GetProjectsQuery : IRequest<BaseResponse<List<ProjectDto>>>
{
}
