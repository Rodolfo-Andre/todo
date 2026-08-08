using FluentValidation;

namespace TaskManagement.Application.Features.Projects.Commands.UpdateProject;

public class UpdateProjectValidator : AbstractValidator<UpdateProjectCommand>
{
    public UpdateProjectValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Project ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Project name is required")
            .MinimumLength(3).WithMessage("Project name must be at least 3 characters")
            .MaximumLength(100).WithMessage("Project name must not exceed 100 characters");
    }
}
