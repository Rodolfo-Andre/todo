using FluentValidation;

namespace TaskManagement.Application.Features.Tasks.Commands.AddComment;

public class AddCommentValidator : AbstractValidator<AddCommentCommand>
{
    public AddCommentValidator()
    {
        RuleFor(x => x.TaskId)
            .NotEmpty().WithMessage("Task ID is required");

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Comment content is required")
            .MaximumLength(2000).WithMessage("Comment must not exceed 2000 characters");
    }
}
