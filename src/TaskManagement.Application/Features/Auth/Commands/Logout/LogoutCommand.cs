using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Auth.Commands.Logout;

public class LogoutCommand : IRequest<BaseResponse<bool>>
{
}
