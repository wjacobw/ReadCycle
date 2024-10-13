import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { UserDocument } from 'src/schemas/User.schema';
import { Response } from 'express'; // Import Express Response

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const user = req.user as UserDocument;
    const jwt = await this.authService.login(user);
    res.redirect(
      `http://localhost:3000/questions-page?token=${jwt.access_token}`,
    );
  }
}
