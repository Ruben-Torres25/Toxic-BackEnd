import { IsEmail, IsIn, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @IsEmail() email: string;
  @IsString() @MinLength(3) password: string;
  @IsString() @IsIn(['ADMIN','USER']) role: 'ADMIN' | 'USER';
}
