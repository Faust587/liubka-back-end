import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  public async create(data: { username: string; password: string }) {
    const { username, password } = data;
    const user = await this.userModel.create({
      username: username,
      password: password,
    });
    return {
      id: user.id,
      username: user.username,
      password: user.password,
    };
  }

  public async getByUsername(data: { username: string }) {
    const { username } = data;
    const user = await this.userModel.findOne({
      username: username,
    });
    if (!user) {
      throw new BadRequestException({
        field: 'username',
        message: 'username does not exist',
      });
    }
    return {
      id: user.id,
      username: user.username,
      password: user.password,
    };
  }

  public async getById(id: string) {
    return this.userModel.findById(id);
  }
}
