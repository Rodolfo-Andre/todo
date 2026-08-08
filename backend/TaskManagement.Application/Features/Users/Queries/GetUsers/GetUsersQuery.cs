using MediatR;
using TaskManagement.Shared.DTOs.Users;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Users.Queries.GetUsers;

public class GetUsersQuery : IRequest<BaseResponse<List<UserDto>>>
{
}
