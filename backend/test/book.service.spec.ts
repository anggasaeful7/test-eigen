import { BookService } from '../src/modules/book/application/services/book.service';
import { IBookRepository } from '../src/modules/book/domain/repositories/book.repository.interface';
import { IBorrowingRepository } from '../src/modules/borrowing/domain/repositories/borrowing.repository.interface';
import { Book } from '../src/modules/book/domain/entities/book.entity';

function mockBookRepo(): jest.Mocked<IBookRepository> {
  return {
    findAll: jest.fn(),
    findByCode: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    saveMany: jest.fn(),
  };
}

function mockBorrowingRepo(): jest.Mocked<IBorrowingRepository> {
  return {
    findActiveBorrowByBook: jest.fn(),
    findActiveBorrowsByMember: jest.fn(),
    findActiveBorrowByMemberAndBook: jest.fn(),
    countActiveBorrowsByBook: jest.fn(),
    save: jest.fn(),
  };
}

describe('BookService', () => {
  let service: BookService;
  let bookRepo: jest.Mocked<IBookRepository>;
  let borrowingRepo: jest.Mocked<IBorrowingRepository>;

  beforeEach(() => {
    bookRepo = mockBookRepo();
    borrowingRepo = mockBorrowingRepo();
    service = new BookService(bookRepo, borrowingRepo);
  });

  it('should return books with available quantity', async () => {
    const books = [
      Object.assign(new Book(), { code: 'JK-45', title: 'Harry Potter', author: 'J.K Rowling', stock: 1 }),
      Object.assign(new Book(), { code: 'SHR-1', title: 'A Study in Scarlet', author: 'Arthur Conan Doyle', stock: 1 }),
    ];

    bookRepo.findAll.mockResolvedValue(books);
    borrowingRepo.countActiveBorrowsByBook
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(0);

    const result = await service.getBooks();

    expect(result).toHaveLength(2);
    expect(result[0].availableQuantity).toBe(0);
    expect(result[1].availableQuantity).toBe(1);
  });

  it('should return empty array when no books exist', async () => {
    bookRepo.findAll.mockResolvedValue([]);
    const result = await service.getBooks();
    expect(result).toHaveLength(0);
  });
});
