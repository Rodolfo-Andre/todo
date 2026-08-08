using FluentValidation;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Application.Features.Tasks.Commands.AddComment;

public class AddCommentValidator : AbstractValidator<AddCommentCommand>
{
    private readonly ILocalizer _localizer;

    public AddCommentValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.TaskId)
            .NotEmpty().WithMessage(_localizer.Get("TaskIdRequired"));

        RuleFor(x => x.Content)
            .NotEmpty().WithMessage(_localizer.Get("CommentRequired"))
            .MaximumLength(2000).WithMessage(_localizer.Get("CommentMaxLength"));
    }
}
