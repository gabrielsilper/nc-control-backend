import EmbeddedUserDTO from 'dtos/embedded-user.dto';
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

export function userToEmbeddedDto(user: User): EmbeddedUserDTO {
  return {
    id: user.id,
    name: user.name,
    profile: user.profile,
  };
}
