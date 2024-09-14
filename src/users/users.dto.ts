// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  readonly name: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
}

// src/users/dto/update-user.dto.ts
export class UpdateUserDto {
  readonly name?: string;
  readonly email?: string;
  password?: string;
}
