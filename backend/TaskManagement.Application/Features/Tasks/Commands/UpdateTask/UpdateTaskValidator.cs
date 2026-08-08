using FluentValidation;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Application.Features.Tasks.Commands.UpdateTask;

public class UpdateTaskValidator : AbstractValidator<UpdateTaskCommand>
{
    private readonly ILocalizer _localizer;

    public UpdateTaskValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage(_localizer.Get("TaskIdRequired"));

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(_localizer.Get("TaskTitleRequired"))
            .MinimumLength(3).WithMessage(_localizer.Get("TaskTitleMinLength"))
            .MaximumLength(200).WithMessage(_localizer.Get("TaskTitleMaxLength"));

        RuleFor(x => x.Priority)
            .InclusiveBetween(0, 3).WithMessage(_localizer.Get("InvalidPriority"));

        RuleFor(x => x.StoryPoints)
            .InclusiveBetween(1, 100).When(x => x.StoryPoints.HasValue)
            .WithMessage(_localizer.Get("InvalidStoryPoints"));
    }
}
