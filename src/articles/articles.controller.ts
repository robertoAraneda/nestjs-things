import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { CheckPolicies } from '../casl/check-policies.decorator';
import { AppAbility } from '../casl/casl.type';
import { JwtGuard } from '../auth/jwt.guard';
import { PoliciesGuard } from '../casl/casl.guard';
import { Ability } from '../casl/ability.decorator';
import { PageOptionsDto } from '../pagination/page-options.dto';
import { PageDto } from '../pagination/page.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @UseGuards(JwtGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('read', 'Article'))
  @ApiBearerAuth()
  @Get()
  findAll(
    @Ability() ability: AppAbility,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Article>> {
    return this.articlesService.findAll(ability, pageOptionsDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articlesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.articlesService.remove(+id);
  }
}
