using MediatR;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Commands.RemoveMember;

public class RemoveMemberHandler : IRequestHandler<RemoveMemberCommand, BaseResponse<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public RemoveMemberHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<BaseResponse<bool>> Handle(RemoveMemberCommand request, CancellationToken cancellationToken)
    {
        var member = (await _unitOfWork.ProjectMembers.FindAsync(
            pm => pm.ProjectId == request.ProjectId && pm.UserId == request.UserId,
            cancellationToken)).FirstOrDefault();

        if (member == null)
        {
            return BaseResponse<bool>.Failure("Member not found in this project");
        }

        _unitOfWork.ProjectMembers.Delete(member);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return BaseResponse<bool>.CreateSuccess(true);
    }
}
