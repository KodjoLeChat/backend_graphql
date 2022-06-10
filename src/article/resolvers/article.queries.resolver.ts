import { HttpException, HttpStatus } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { ArticleService } from '../article.service';
import { Article } from '../models/article.model';

@Resolver(Article)
export class ArticleQueriesResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Query(() => [Article])
  async articlesList(): Promise<Article[]> {
    const articles = await this.articleService.articlesList();
    if (articles) return articles;
    throw new HttpException('Articles not found', HttpStatus.NOT_FOUND);
  }
}
