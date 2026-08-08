using FluentValidation;
using TaskManagement.Application.Common.Interfaces;

namespace TaskManagement.Application.Features.Auth.Commands.RefreshToken;

public class RefreshTokenValidator : AbstractValidator<RefreshTokenCommand>
{
    private readonly ILocalizer _localizer;

    public RefreshTokenValidator(ILocalizer localizer)
    {
        _localizer = localizer;

        RuleFor(x => x.RefreshToken)
            .NotEmpty().WithMessage(_localizer.Get("RefreshTokenRequired"));
    }
}
