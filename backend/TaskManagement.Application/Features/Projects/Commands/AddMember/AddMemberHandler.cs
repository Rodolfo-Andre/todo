using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Commands.AddMember;

public class AddMemberHandler : IRequestHandler<AddMemberCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public AddMemberHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseResponse<bool>> Handle(AddMemberCommand request, CancellationToken cancellationToken)
    {
        var project = await _unitOfWork.Projects.GetByIdAsync(request.ProjectId, cancellationToken);

        if (project == null || project.DeletedAt.HasValue)
        {
            return BaseResponse<bool>.Failure("Project not found");
        }

        // Check if user is already a member
        var existingMember = (await _unitOfWork.ProjectMembers.FindAsync(
            pm => pm.ProjectId == request.ProjectId && pm.UserId == request.UserId,
            cancellationToken)).FirstOrDefault();

        if (existingMember != null)
        {
            return BaseResponse<bool>.Failure("User is already a member of this project");
        }

        var member = new ProjectMember
        {
            ProjectId = request.ProjectId,
            UserId = request.UserId,
            ProjectRole = request.ProjectRole,
            JoinedAt = DateTime.UtcNow
        };

        await _unitOfWork.ProjectMembers.AddAsync(member, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return BaseResponse<bool>.CreateSuccess(true);
    }
}
