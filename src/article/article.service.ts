import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SortDirection } from 'src/pagination/dtos/pagination.dto';
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
import {
  ArticlesPagination,
  ArticlesPaginationArgs,
} from './dtos/articles-pagination.dto';
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
    article.updatedAt = new Date();
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

  async articlesPagination(
    args: ArticlesPaginationArgs,
    limit: number,
  ): Promise<ArticlesPagination> {
    const qb = this.articleRepository.createQueryBuilder('article');
    qb.take(limit);
    qb.skip(args.page);
    const createdAt = args.sortBy?.createdAt;
    if (createdAt !== null) {
      qb.addOrderBy(
        'article.createdAt',
        createdAt === SortDirection.ASC ? 'ASC' : 'DESC',
      );
    }
    const title = args.sortBy?.title;
    if (title !== null) {
      qb.addOrderBy(
        'article.title',
        title === SortDirection.ASC ? 'ASC' : 'DESC',
      );
    }
    const [nodes, totalCount] = await qb.getManyAndCount();
    // const [nodes, totalCount] = await this.articleRepository.findAndCount({
    //   skip: args.page,
    //   take: limit,
    //   order: {
    //     createdAt: args.sortBy?.createdAt == SortDirection.ASC ? 'ASC' : 'DESC',
    //   },
    // });
    return {
      nodes,
      totalCount,
      page: 0,
      totalPages: this.totalPage(totalCount, limit),
    };
  }

  async getArticle(articleId: Article['id']): Promise<Article | null> {
    const article = await this.articleRepository.findOneOrFail({
      where: { id: articleId },
    });
    if (article) return article;
    return null;
  }

  async articlesNumber(): Promise<number | null> {
    const count = await this.articleRepository.count();
    if (count) return count;
    return null;
  }

  totalPage(totalCount: number, limit: number): number {
    if (totalCount < limit) return 1;
    if (totalCount % limit == 0) return totalCount / limit;
    return Math.floor(totalCount / limit) + 1;
  }
}
