import { Field, ID, InterfaceType } from '@nestjs/graphql';
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@InterfaceType()
export abstract class Node extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @CreateDateColumn()
  updatedAt: Date;
}
