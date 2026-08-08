using FluentValidation;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Application.Features.Tasks.Commands.ChangeStatus;

public class ChangeStatusValidator : AbstractValidator<ChangeStatusCommand>
{
    private readonly ILocalizer _localizer;

    public ChangeStatusValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage(_localizer.Get("TaskIdRequired"));

        RuleFor(x => x.Status)
            .InclusiveBetween(0, 4).WithMessage(_localizer.Get("InvalidStatus"));
    }
}
