using FluentValidation;
using TaskManagement.Application.Common.Interfaces;
using TaskManagement.Shared.Constants;

namespace TaskManagement.Application.Features.Users.Commands.ChangeRole;

public class ChangeRoleValidator : AbstractValidator<ChangeRoleCommand>
{
    private readonly ILocalizer _localizer;

    public ChangeRoleValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.UserId)
            .NotEmpty().WithMessage(_localizer.Get("UserIdRequired"));

        RuleFor(x => x.Role)
            .NotEmpty().WithMessage(_localizer.Get("RoleRequired"))
            .Must(role => new[] 
            { 
                RoleConstants.Admin, 
                RoleConstants.ProjectManager, 
                RoleConstants.Developer, 
                RoleConstants.Viewer 
            }.Contains(role))
            .WithMessage(_localizer.Get("InvalidRole"));
    }
}
