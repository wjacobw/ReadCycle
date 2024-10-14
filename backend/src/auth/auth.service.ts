import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '../schemas/User.schema';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: UserDocument) {
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload), 
    };
  }
}
