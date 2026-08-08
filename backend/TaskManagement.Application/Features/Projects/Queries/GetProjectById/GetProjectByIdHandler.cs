using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.DTOs.Projects;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Queries.GetProjectById;

public class GetProjectByIdHandler : IRequestHandler<GetProjectByIdQuery, BaseResponse<ProjectDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILocalizer _localizer;

    public GetProjectByIdHandler(IUnitOfWork unitOfWork, ILocalizer localizer)
    {
        _unitOfWork = unitOfWork;
        _localizer = localizer;
    }

    public async Task<BaseResponse<ProjectDto>> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(request.Id, cancellationToken);

        if (project == null || project.DeletedAt.HasValue)
        {
            return BaseResponse<ProjectDto>.Failure(_localizer.Get("ProjectNotFound"));
        }

        var taskCount = (await _unitOfWork.Tasks.FindAsync(
            t => t.ProjectId == project.Id && !t.DeletedAt.HasValue,
            cancellationToken)).Count;

        var memberCount = (await _unitOfWork.ProjectMembers.FindAsync(
            pm => pm.ProjectId == project.Id,
            cancellationToken)).Count;

        var projectDto = new ProjectDto
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
        };

        return BaseResponse<ProjectDto>.CreateSuccess(projectDto);
    }
}
