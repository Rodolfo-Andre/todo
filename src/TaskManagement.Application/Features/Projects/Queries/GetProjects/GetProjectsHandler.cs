using MediatR;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.DTOs.Projects;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Queries.GetProjects;

public class GetProjectsHandler : IRequestHandler<GetProjectsQuery, BaseResponse<List<ProjectDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public GetProjectsHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<BaseResponse<List<ProjectDto>>> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
    {
        var userId = Guid.Parse(_currentUserService.UserId);

        // Get projects where user is a member
        var memberProjectIds = (await _unitOfWork.ProjectMembers.FindAsync(
            pm => pm.UserId == userId, cancellationToken))
            .Select(pm => pm.ProjectId)
            .ToList();

        var projects = (await _unitOfWork.Projects.FindAsync(
            p => memberProjectIds.Contains(p.Id) && !p.DeletedAt.HasValue,
            cancellationToken))
            .ToList();

        var projectDtos = new List<ProjectDto>();

        foreach (var project in projects)
        {
            var taskCount = (await _unitOfWork.Tasks.FindAsync(
                t => t.ProjectId == project.Id && !t.DeletedAt.HasValue,
                cancellationToken)).Count;

            var memberCount = (await _unitOfWork.ProjectMembers.FindAsync(
                pm => pm.ProjectId == project.Id,
                cancellationToken)).Count;

            projectDtos.Add(new ProjectDto
            {
                Id = project.Id,
                Name = project.Name,
                Description = project.Description,
                Key = project.Key,
                OwnerId = project.OwnerId,
                Status = project.Status,
                TaskCount = taskCount,
                MemberCount = memberCount,
                CreatedAt = project.CreatedAt
            });
        }

        return BaseResponse<List<ProjectDto>>.CreateSuccess(projectDtos);
    }
}
