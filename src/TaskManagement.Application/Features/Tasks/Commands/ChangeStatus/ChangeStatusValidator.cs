using FluentValidation;

namespace TaskManagement.Application.Features.Tasks.Commands.ChangeStatus;

public class ChangeStatusValidator : AbstractValidator<ChangeStatusCommand>
{
    public ChangeStatusValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Task ID is required");

        RuleFor(x => x.Status)
            .InclusiveBetween(0, 4).WithMessage("Status must be between 0 and 4");
    }
}
