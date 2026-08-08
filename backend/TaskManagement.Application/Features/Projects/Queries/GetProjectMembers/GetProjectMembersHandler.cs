using MediatR;
using Microsoft.AspNetCore.Identity;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Domain.Entities;
using TaskManagement.Shared.DTOs.Projects;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Projects.Queries.GetProjectMembers;

public class GetProjectMembersHandler : IRequestHandler<GetProjectMembersQuery, BaseResponse<List<ProjectMemberDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly UserManager<User> _userManager;

    public GetProjectMembersHandler(IUnitOfWork unitOfWork, UserManager<User> userManager)
    {
        _unitOfWork = unitOfWork;
        _userManager = userManager;
    }

    public async Task<BaseResponse<List<ProjectMemberDto>>> Handle(GetProjectMembersQuery request, CancellationToken cancellationToken)
    {
        var members = (await _unitOfWork.ProjectMembers.FindAsync(
            pm => pm.ProjectId == request.ProjectId,
            cancellationToken))
            .ToList();

        var memberDtos = new List<ProjectMemberDto>();

        foreach (var member in members)
        {
            var user = await _userManager.FindByIdAsync(member.UserId.ToString());
            if (user != null)
            {
                memberDtos.Add(new ProjectMemberDto
                {
                    Id = member.Id,
                    UserId = member.UserId,
                    UserName = user.UserName!,
                    FullName = user.FullName,
                    Email = user.Email!,
                    ProjectRole = member.ProjectRole,
                    JoinedAt = member.JoinedAt
                });
            }
        }

        return BaseResponse<List<ProjectMemberDto>>.CreateSuccess(memberDtos);
    }
}
