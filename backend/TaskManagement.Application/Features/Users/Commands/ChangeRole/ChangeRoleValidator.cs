using FluentValidation;
using TaskManagement.Shared.Constants;

namespace TaskManagement.Application.Features.Users.Commands.ChangeRole;

public class ChangeRoleValidator : AbstractValidator<ChangeRoleCommand>
{
    public ChangeRoleValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage("User ID is required");

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage("Role is required")
            .Must(role => new[] 
            { 
                RoleConstants.Admin, 
                RoleConstants.ProjectManager, 
                RoleConstants.Developer, 
                RoleConstants.Viewer 
            }.Contains(role))
            .WithMessage("Invalid role. Must be: Admin, ProjectManager, Developer, or Viewer");
    }
}
