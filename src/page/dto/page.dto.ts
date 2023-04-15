import { IsString } from 'class-validator';

export class PageDto {
  @IsString()
  title: string;

  @IsString()
  heading: string;

  @IsString()
  imageURL: string;

  @IsString()
  text: string;
}
