using FluentValidation;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Application.Features.Projects.Commands.CreateProject;

public class CreateProjectValidator : AbstractValidator<CreateProjectCommand>
{
    private readonly ILocalizer _localizer;

    public CreateProjectValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage(_localizer.Get("ProjectNameRequired"))
            .MinimumLength(3).WithMessage(_localizer.Get("ProjectNameMinLength"))
            .MaximumLength(100).WithMessage(_localizer.Get("ProjectNameMaxLength"));

        RuleFor(x => x.Key)
            .NotEmpty().WithMessage(_localizer.Get("ProjectKeyRequired"))
            .MinimumLength(2).WithMessage(_localizer.Get("ProjectKeyMinLength"))
            .MaximumLength(10).WithMessage(_localizer.Get("ProjectKeyMaxLength"))
            .Matches("^[A-Z0-9]+$").WithMessage(_localizer.Get("ProjectKeyPattern"));
    }
}
