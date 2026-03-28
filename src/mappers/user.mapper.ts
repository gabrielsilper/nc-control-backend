import ResponseUserDTO from 'dtos/response-user.dto';
import User from 'entities/user';

export function userToResponseDto(user: User): ResponseUserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    profile: user.profile,
  };
}
