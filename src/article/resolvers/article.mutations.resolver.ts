import { HttpException, HttpStatus } from '@nestjs/common';
import { Args, ID, Mutation, Resolver } from '@nestjs/graphql';
import { ArticleService } from '../article.service';
import {
  ArticleCreateInput,
  ArticleCreateOutput,
} from '../dtos/article-create.dto';
import { ArticleDeleteOutput } from '../dtos/article-delete.dto';
import {
  ArticleUpdateInput,
  ArticleUpdateOutput,
} from '../dtos/article-update.dto';
import { Article } from '../models/article.model';

@Resolver(Article)
export class ArticleMutationsResolver {
  constructor(private readonly articleService: ArticleService) {}

  @Mutation(() => ArticleCreateOutput)
  async articleCreate(
    @Args('input') input: ArticleCreateInput,
  ): Promise<ArticleCreateOutput> {
    const article = await this.articleService.createArticle(input);
    if (article) return article;
    throw new HttpException('Article not created', HttpStatus.NOT_MODIFIED);
  }

  @Mutation(() => ArticleUpdateOutput)
  async articleUpdate(
    @Args({ name: 'articleId', type: () => ID }) articleId: Article['id'],
    @Args('input') input: ArticleUpdateInput,
  ): Promise<ArticleUpdateOutput> {
    const article = await this.articleService.updateArticle(articleId, input);
    if (article) return article;
    throw new HttpException('Article not updated', HttpStatus.NOT_MODIFIED);
  }

  @Mutation(() => ArticleDeleteOutput)
  async articleDelete(
    @Args({ name: 'articleId', type: () => ID }) articleId: Article['id'],
  ): Promise<ArticleDeleteOutput> {
    const article = await this.articleService.deleteArticle(articleId);
    if (article) return article;
    throw new HttpException('Article not deleted', HttpStatus.NOT_MODIFIED);
  }
}
