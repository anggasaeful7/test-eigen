import { DataSource } from 'typeorm';
import { Book } from '../modules/book/domain/entities/book.entity';
import { Member } from '../modules/member/domain/entities/member.entity';
import { Borrowing } from '../modules/borrowing/domain/entities/borrowing.entity';

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'database.sqlite',
  entities: [Book, Member, Borrowing],
  synchronize: true,
  logging: false,
});
