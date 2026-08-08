using FluentValidation;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Application.Features.Auth.Commands.Login;

public class LoginValidator : AbstractValidator<LoginCommand>
{
    private readonly ILocalizer _localizer;

    public LoginValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage(_localizer.Get("EmailRequired"))
            .EmailAddress().WithMessage(_localizer.Get("InvalidEmail"));

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage(_localizer.Get("PasswordRequired"));
    }
}
