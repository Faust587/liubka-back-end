import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from './token.schema';
import { IJwtPayload } from '../auth/jwt-payload.interface';
import { InjectModel } from '@nestjs/mongoose';

export type TTokensPair = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  public generateTokensPair(payload: IJwtPayload): TTokensPair {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: 10_000,
      // expiresIn: 10,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: 60_000,
      //expiresIn: 20,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  public async isRefreshTokenExists(token: string): Promise<boolean> {
    return !!(await this.refreshTokenModel.findOne({ token }));
  }

  public async deleteRefreshTokenByToken(token: string): Promise<void> {
    await this.refreshTokenModel.findOneAndDelete({ token });
  }

  public checkRefreshToken(token: string): void {
    try {
      this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
  }

  public getPayloadFromToken(token: string): IJwtPayload {
    const { id, activated } = this.jwtService.decode(token) as IJwtPayload;
    return {
      id,
      activated,
    };
  }

  public async saveRefreshToken(token: string, userId: string) {
    return await this.refreshTokenModel
      .create({
        token,
        user: userId,
      })
      .catch((reason) => {
        throw new InternalServerErrorException(reason);
      });
  }
}
