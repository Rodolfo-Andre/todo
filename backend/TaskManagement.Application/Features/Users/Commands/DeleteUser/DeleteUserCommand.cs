using MediatR;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Users.Commands.DeleteUser;

public class DeleteUserCommand : IRequest<BaseResponse<bool>>
{
    public Guid Id { get; set; }
}
