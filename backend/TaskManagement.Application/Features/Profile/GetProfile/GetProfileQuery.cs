using MediatR;
using TaskManagement.Shared.DTOs.Profile;
using TaskManagement.Shared.Models;

namespace TaskManagement.Application.Features.Profile.GetProfile;

public class GetProfileQuery : IRequest<BaseResponse<ProfileDto>>
{
}
