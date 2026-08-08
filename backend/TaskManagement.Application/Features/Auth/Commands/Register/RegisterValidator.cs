using FluentValidation;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Application.Features.Auth.Commands.Register;

public class RegisterValidator : AbstractValidator<RegisterCommand>
{
    private readonly ILocalizer _localizer;

    public RegisterValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.UserName)
            .NotEmpty().WithMessage(_localizer.Get("UsernameRequired"))
            .MinimumLength(3).WithMessage(_localizer.Get("UsernameMinLength"))
            .MaximumLength(50).WithMessage(_localizer.Get("UsernameMaxLength"));

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(_localizer.Get("EmailRequired"))
            .EmailAddress().WithMessage(_localizer.Get("InvalidEmail"));

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage(_localizer.Get("PasswordRequired"))
            .MinimumLength(8).WithMessage(_localizer.Get("PasswordMinLength"))
            .Matches("[A-Z]").WithMessage(_localizer.Get("PasswordRequiresUpper"))
            .Matches("[a-z]").WithMessage(_localizer.Get("PasswordRequiresLower"))
            .Matches("[0-9]").WithMessage(_localizer.Get("PasswordRequiresDigit"));

        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage(_localizer.Get("FullNameRequired"))
            .MinimumLength(2).WithMessage(_localizer.Get("FullNameMinLength"))
            .MaximumLength(100).WithMessage(_localizer.Get("FullNameMaxLength"));
    }
}
