import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  async loginUser(@Res() res: Response, @Body() userLoginDto: UserLoginDto) {
    const { username, password } = userLoginDto;
    const { user, refreshToken, accessToken } = await this.authService.login({
      username,
      password,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });
    res.json({
      user,
      accessToken,
    });
  }

  @Get('/refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      throw new UnauthorizedException('There is no refresh token in cookies');

    const tokensPair = await this.authService.refreshToken(refreshToken);
    res.clearCookie('refreshToken');
    res.cookie('refreshToken', tokensPair.refreshToken, {
      httpOnly: true,
    });
    res.json({ accessToken: tokensPair.accessToken });
    res.send();
  }

  @Post('test')
  @UsePipes(ValidationPipe)
  async register(@Res() res: Response, @Body() userLoginDto: UserLoginDto) {
    const { username, password } = userLoginDto;
    const { user, refreshToken, accessToken } = await this.authService.register(
      {
        username,
        password,
      },
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
    });
    res.json({
      user,
      accessToken,
    });
  }
}
