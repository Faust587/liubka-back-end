import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page, PageDocument } from './token.schema';

@Injectable()
export class PageService {
  constructor(@InjectModel(Page.name) private pageModel: Model<PageDocument>) {}

  async getAll() {
    return this.pageModel.find();
  }

  async getById(id: string) {
    return this.pageModel.findById(id);
  }

  async create(title: string, heading: string, imageURL: string, text: string) {
    return this.pageModel.create({ title, heading, imageURL, text });
  }

  async updateById(
    id: string,
    title: string,
    heading: string,
    imageURL: string,
    text: string,
  ) {
    return this.pageModel.findByIdAndUpdate(
      id,
      { title, heading, imageURL, text },
      { new: true },
    );
  }

  async delete(id: string) {
    return this.pageModel.findByIdAndDelete(id);
  }
}
