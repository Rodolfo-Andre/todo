using FluentValidation;

namespace TaskManagement.Application.Features.Tasks.Commands.CreateTask;

public class CreateTaskValidator : AbstractValidator<CreateTaskCommand>
{
    public CreateTaskValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Task title is required")
            .MinimumLength(3).WithMessage("Task title must be at least 3 characters")
            .MaximumLength(200).WithMessage("Task title must not exceed 200 characters");

        RuleFor(x => x.ProjectId)
            .NotEmpty().WithMessage("Project is required");

        RuleFor(x => x.Priority)
            .InclusiveBetween(0, 3).WithMessage("Priority must be between 0 and 3");

        RuleFor(x => x.StoryPoints)
            .InclusiveBetween(1, 100).When(x => x.StoryPoints.HasValue)
            .WithMessage("Story points must be between 1 and 100");
    }
}
