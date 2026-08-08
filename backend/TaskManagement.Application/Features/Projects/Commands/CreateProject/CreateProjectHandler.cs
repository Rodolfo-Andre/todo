using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Commands.CreateProject;

public class CreateProjectHandler : IRequestHandler<CreateProjectCommand, BaseResponse<Guid>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILocalizer _localizer;

    public CreateProjectHandler(IUnitOfWork unitOfWork, ICurrentUserService currentUserService, ILocalizer localizer)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _localizer = localizer;
    }

    public async Task<BaseResponse<Guid>> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        // Check if key already exists
        var existingProject = (await _unitOfWork.Projects.FindAsync(
            p => p.Key == request.Key && !p.DeletedAt.HasValue, cancellationToken)).FirstOrDefault();

        if (existingProject != null)
        {
            return BaseResponse<Guid>.Failure(_localizer.Get("ProjectKeyAlreadyExists"));
        }

        var userId = Guid.Parse(_currentUserService.UserId);

        var project = new Project
        {
            Name = request.Name,
            Description = request.Description,
            Key = request.Key.ToUpper(),
            OwnerId = userId,
            Status = 0,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = _currentUserService.UserId
        };

        await _unitOfWork.Projects.AddAsync(project, cancellationToken);

        // Add owner as admin member
        var member = new ProjectMember
        {
            ProjectId = project.Id,
            UserId = userId,
            ProjectRole = 0, // Admin
            JoinedAt = DateTime.UtcNow
        };

        await _unitOfWork.ProjectMembers.AddAsync(member, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return BaseResponse<Guid>.CreateSuccess(project.Id);
    }
}
