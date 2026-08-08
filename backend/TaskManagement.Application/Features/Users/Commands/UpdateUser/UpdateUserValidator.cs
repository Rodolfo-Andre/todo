using FluentValidation;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Application.Features.Users.Commands.UpdateUser;

public class UpdateUserValidator : AbstractValidator<UpdateUserCommand>
{
    private readonly ILocalizer _localizer;

    public UpdateUserValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage(_localizer.Get("UserIdRequired"));

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage(_localizer.Get("FullNameRequired"))
            .MinimumLength(2).WithMessage(_localizer.Get("FullNameMinLength"))
            .MaximumLength(100).WithMessage(_localizer.Get("FullNameMaxLength"));

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(_localizer.Get("EmailRequired"))
            .EmailAddress().WithMessage(_localizer.Get("InvalidEmail"));
    }
}
