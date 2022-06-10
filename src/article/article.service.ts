import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ArticleCreateInput,
  ArticleCreateOutput,
} from './dtos/article-create.dto';
import { ArticleDeleteOutput } from './dtos/article-delete.dto';
import {
  ArticleUpdateInput,
  ArticleUpdateOutput,
} from './dtos/article-update.dto';
import { Article } from './models/article.model';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async createArticle(
    input: ArticleCreateInput,
  ): Promise<ArticleCreateOutput | null> {
    const newArticle = this.articleRepository.create(input);
    const article = await this.articleRepository.save(newArticle);
    if (article) {
      const response = new ArticleCreateOutput();
      response.article = article;
      return response;
    }
    return null;
  }

  async updateArticle(
    articleId: Article['id'],
    input: ArticleUpdateInput,
  ): Promise<ArticleUpdateOutput | null> {
    let article = await this.articleRepository.findOneOrFail({
      where: { id: articleId },
    });
    if (!article) return null;
    article.description = input.description;
    article.image = input.image;
    article.title = input.title;
    article = await this.articleRepository.save(article);
    if (!article) return null;
    const res = new ArticleUpdateOutput();
    res.article = article;
    return res;
  }

  async deleteArticle(
    articleId: Article['id'],
  ): Promise<ArticleDeleteOutput | null> {
    let article = await this.articleRepository.findOneOrFail({
      where: { id: articleId },
    });
    if (!article) return null;
    article = await article.remove();
    if (!article) return null;
    return { articleId };
  }

  async articlesList(): Promise<Article[]> {
    const articles = await this.articleRepository.find();
    if (articles) return articles;
    return null;
  }
}
