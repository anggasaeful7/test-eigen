import { Repository, DataSource } from 'typeorm';
import { Book } from '../../domain/entities/book.entity';
import { IBookRepository } from '../../domain/repositories/book.repository.interface';

export class BookTypeOrmRepository implements IBookRepository {
  private repository: Repository<Book>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Book);
  }

  async findAll(): Promise<Book[]> {
    return this.repository.find();
  }

  async findByCode(code: string): Promise<Book | null> {
    return this.repository.findOne({ where: { code } });
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async save(book: Book): Promise<Book> {
    return this.repository.save(book);
  }

  async saveMany(books: Book[]): Promise<Book[]> {
    return this.repository.save(books);
  }
}
