using MediatR;
using TaskManagement.Shared.DTOs.Users;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Users.Queries.GetUserById;

public class GetUserByIdQuery : IRequest<BaseResponse<UserDto>>
{
    public Guid Id { get; set; }
}
