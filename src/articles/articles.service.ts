import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';
import { AppAbility } from '../casl/casl.type';
import { subject } from '@casl/ability';
import { PageOptionsDto } from '../pagination/page-options.dto';
import { PageMetaDto } from '../pagination/page-meta.dto';
import { PageDto } from '../pagination/page.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly _articlesRepository: Repository<Article>,
  ) {}
  create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = new Article(createArticleDto);

    return this._articlesRepository.save(article);
  }

  async findAll(
    ability: AppAbility,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Article>> {
    const rule = ability.rules.find(
      (rule) => rule.action === 'read' && rule.subject === 'Article',
    );

    const [data, itemCount] = await this._articlesRepository.findAndCount({
      withDeleted: true,
      take: pageOptionsDto.take,
      skip: pageOptionsDto.skip,
      where: {
        user: {
          id: rule.conditions.userId as string,
        },
      },
    });

    const article = data.filter((article) =>
      ability.can('read', subject('Article', article)),
    );

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(article, pageMetaDto);
  }

  async findOne(id: number) {
    const article = await this._articlesRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const article = await this._articlesRepository.findOne({ where: { id } });

    if (!article) throw new NotFoundException('Article not found');

    this._articlesRepository.merge(article, updateArticleDto);

    return this._articlesRepository.save(article);
  }

  async remove(id: number): Promise<void> {
    const article = await this._articlesRepository.findOne({ where: { id } });

    if (!article) throw new NotFoundException('Article not found');

    this._articlesRepository.softRemove(article);
  }
}
