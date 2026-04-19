import { IBookRepository } from '../../domain/repositories/book.repository.interface';
import { IBorrowingRepository } from '../../../borrowing/domain/repositories/borrowing.repository.interface';
import { BookResponseDto } from '../dto/book-response.dto';

export class BookService {
  constructor(
    private bookRepository: IBookRepository,
    private borrowingRepository: IBorrowingRepository,
  ) {}

  async getBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.findAll();

    const result: BookResponseDto[] = [];
    for (const book of books) {
      const activeBorrows = await this.borrowingRepository.countActiveBorrowsByBook(book.code);
      result.push({
        code: book.code,
        title: book.title,
        author: book.author,
        stock: book.stock,
        availableQuantity: book.stock - activeBorrows,
      });
    }

    return result;
  }
}
