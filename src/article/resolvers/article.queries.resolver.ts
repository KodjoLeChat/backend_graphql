import { HttpException, HttpStatus } from '@nestjs/common';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { ArticleService } from '../article.service';
import {
  ArticlesPagination,
  ArticlesPaginationArgs,
} from '../dtos/articles-pagination.dto';
import { Article } from '../models/article.model';

@Resolver(Article)
export class ArticleQueriesResolver {
  constructor(private readonly articleService: ArticleService) {}

  private readonly limit = parseInt(process.env.LIMIT);

  @Query(() => ArticlesPagination)
  async articlesPagination(
    @Args() args: ArticlesPaginationArgs,
  ): Promise<ArticlesPagination> {
    const count = await this.articleService.articlesNumber();
    if (!count) {
      throw new HttpException(
        'There is an error. Please try again',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      args.page <= 0 ||
      args.page > this.articleService.totalPage(count, this.limit)
    ) {
      throw new HttpException('This page not exists', HttpStatus.NOT_FOUND);
    }
    const page = args.page;
    args.page = (page - 1) * this.limit;
    const articles = await this.articleService.articlesPagination(
      args,
      this.limit,
    );
    if (articles) {
      articles.page = page;
      return articles;
    }
    throw new HttpException('Articles not found', HttpStatus.NOT_FOUND);
  }

  @Query(() => Article)
  async getArticle(
    @Args({ name: 'articleId', type: () => ID }) articleId: Article['id'],
  ): Promise<Article> {
    const article = await this.articleService.getArticle(articleId);
    if (article) return article;
    throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
  }
}
