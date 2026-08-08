using FluentValidation;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Application.Features.Projects.Commands.UpdateProject;

public class UpdateProjectValidator : AbstractValidator<UpdateProjectCommand>
{
    private readonly ILocalizer _localizer;

    public UpdateProjectValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage(_localizer.Get("ProjectIdRequired"));

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(_localizer.Get("ProjectNameRequired"))
            .MinimumLength(3).WithMessage(_localizer.Get("ProjectNameMinLength"))
            .MaximumLength(100).WithMessage(_localizer.Get("ProjectNameMaxLength"));
    }
}
