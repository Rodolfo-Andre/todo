using FluentValidation;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Application.Features.Tasks.Commands.CreateTask;

public class CreateTaskValidator : AbstractValidator<CreateTaskCommand>
{
    private readonly ILocalizer _localizer;

    public CreateTaskValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.Title)
            .NotEmpty().WithMessage(_localizer.Get("TaskTitleRequired"))
            .MinimumLength(3).WithMessage(_localizer.Get("TaskTitleMinLength"))
            .MaximumLength(200).WithMessage(_localizer.Get("TaskTitleMaxLength"));

        RuleFor(x => x.ProjectId)
            .NotEmpty().WithMessage(_localizer.Get("ProjectRequired"));

        RuleFor(x => x.Priority)
            .InclusiveBetween(0, 3).WithMessage(_localizer.Get("InvalidPriority"));

        RuleFor(x => x.StoryPoints)
            .InclusiveBetween(1, 100).When(x => x.StoryPoints.HasValue)
            .WithMessage(_localizer.Get("InvalidStoryPoints"));
    }
}
