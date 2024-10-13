import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import process from 'process';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'GMGCfFLMMd3D+xlFzhhRjKLCtAPMc3hTMab5fo4bgms=',
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findByGoogleId(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
