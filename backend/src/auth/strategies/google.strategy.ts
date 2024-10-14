import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserDocument } from 'src/schemas/User.schema';
import { UsersService } from 'src/users/users.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private usersService: UsersService) {
    super({
      clientID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3009/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, emails, displayName } = profile;
      const email = emails[0].value;
      let user = await this.usersService.findByGoogleId(id);
      if (!user) {
        user = await this.usersService.createWithGoogle({
          googleId: id,
          email,
          displayName,
        });
      }

      return done(null, user);
    } catch (error) {
      console.error('Error during Google login:', error);
      return done(error, null);
    }
  }
}
