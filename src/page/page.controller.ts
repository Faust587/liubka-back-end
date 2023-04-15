import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PageService } from './page.service';
import { PageDto } from './dto/page.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('page')
export class PageController {
  constructor(private pageService: PageService) {}

  @Get()
  getAll(@Query('id') id: string | undefined) {
    if (id) {
      //return this.pageService.getAll();
    } else {
      return this.pageService.getAll();
    }
  }

  @Post()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  create(@Body() createPage: PageDto) {
    const { title, imageURL, text, heading } = createPage;
    return this.pageService.create(title, heading, imageURL, text);
  }

  @Put()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  update(@Query('id') id: string | undefined, @Body() updatePage: PageDto) {
    if (id) {
      const { title, imageURL, text, heading } = updatePage;
      return this.pageService.updateById(id, title, heading, imageURL, text);
    } else {
    }
  }

  @Delete()
  @UseGuards(AuthGuard())
  @UsePipes(ValidationPipe)
  delete(@Query('id') id: string | undefined) {
    if (id) {
      return this.pageService.delete(id);
    } else {
    }
  }
}
