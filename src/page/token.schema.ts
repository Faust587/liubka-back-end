import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';

export type PageDocument = HydratedDocument<Page>;

@Schema()
export class Page {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  heading: string;

  @Prop({ type: String, required: true })
  imageURL: string;

  @Prop({ type: String, required: true })
  text: string;
}

export const PageSchema = SchemaFactory.createForClass(Page);
