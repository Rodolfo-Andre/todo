using FluentValidation;

namespace TaskManagement.Application.Features.Projects.Commands.CreateProject;

public class CreateProjectValidator : AbstractValidator<CreateProjectCommand>
{
    public CreateProjectValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Project name is required")
            .MinimumLength(3).WithMessage("Project name must be at least 3 characters")
            .MaximumLength(100).WithMessage("Project name must not exceed 100 characters");

        RuleFor(x => x.Key)
            .NotEmpty().WithMessage("Project key is required")
            .MinimumLength(2).WithMessage("Project key must be at least 2 characters")
            .MaximumLength(10).WithMessage("Project key must not exceed 10 characters")
            .Matches("^[A-Z0-9]+$").WithMessage("Project key must contain only uppercase letters and numbers");
    }
}
