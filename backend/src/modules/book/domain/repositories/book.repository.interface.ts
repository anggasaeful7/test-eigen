import { Book } from '../entities/book.entity';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findByCode(code: string): Promise<Book | null>;
  count(): Promise<number>;
  save(book: Book): Promise<Book>;
  saveMany(books: Book[]): Promise<Book[]>;
}
