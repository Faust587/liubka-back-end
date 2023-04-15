import { genSalt, hash, compare } from 'bcrypt';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { IJwtPayload } from './jwt-payload.interface';
import { TokenService, TTokensPair } from '../token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  public async login(data: { username: string; password: string }) {
    const { username, password } = data;
    const user = await this.userService.getByUsername({ username: username });
    const hashedPassword = user.password;
    const compareResult = await compare(password, hashedPassword);
    if (!compareResult) throw new ForbiddenException('Password is not correct');

    const payload: IJwtPayload = {
      id: user.id.toString(),
      activated: false,
    };

    const { accessToken, refreshToken } =
      this.tokenService.generateTokensPair(payload);

    await this.tokenService.saveRefreshToken(refreshToken, user.id);

    return {
      user: {
        id: user.id,
      },
      accessToken,
      refreshToken,
    };
  }

  public async register(data: { username: string; password: string }) {
    const { username, password } = data;
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    const user = await this.userService.create({
      username,
      password: hashedPassword,
    });
    const { accessToken, refreshToken } = this.tokenService.generateTokensPair({
      id: user.id,
      activated: false,
    });
    await this.tokenService.saveRefreshToken(refreshToken, user.id);
    return {
      user: {
        id: user.id,
      },
      accessToken,
      refreshToken,
    };
  }

  public async refreshToken(token: string): Promise<TTokensPair> {
    this.tokenService.checkRefreshToken(token);
    const isTokenExistsInDb = await this.tokenService.isRefreshTokenExists(
      token,
    );
    if (!isTokenExistsInDb)
      throw new UnauthorizedException('Token is not exists in db');
    await this.tokenService.deleteRefreshTokenByToken(token);
    const payload = this.tokenService.getPayloadFromToken(token);
    const user = await this.userService.getById(payload.id);
    if (!user) throw new NotFoundException('This user is not exists');
    const tokensPair = this.tokenService.generateTokensPair(payload);
    await this.tokenService.saveRefreshToken(tokensPair.refreshToken, user.id);
    return tokensPair;
  }
}
