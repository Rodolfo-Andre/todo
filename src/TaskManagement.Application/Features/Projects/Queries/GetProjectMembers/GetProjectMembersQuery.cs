using MediatR;
using TaskManagement.Shared.DTOs.Projects;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Queries.GetProjectMembers;

public class GetProjectMembersQuery : IRequest<BaseResponse<List<ProjectMemberDto>>>
{
    public Guid ProjectId { get; set; }
}
