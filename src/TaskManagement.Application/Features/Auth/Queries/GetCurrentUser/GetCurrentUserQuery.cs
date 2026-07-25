using MediatR;
using TaskManagement.Shared.DTOs.Auth;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Auth.Queries.GetCurrentUser;

public class GetCurrentUserQuery : IRequest<BaseResponse<UserDto>>
{
}
