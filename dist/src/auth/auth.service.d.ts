import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
export declare class AuthService {
    private users;
    private jwt;
    constructor(users: Repository<User>, jwt: JwtService);
    signup(dto: SignupDto): Promise<{
        ok: boolean;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
}
