import { BorrowingService } from '../src/modules/borrowing/application/services/borrowing.service';
import { BorrowingDomainService } from '../src/modules/borrowing/domain/services/borrowing-domain.service';
import { IBookRepository } from '../src/modules/book/domain/repositories/book.repository.interface';
import { IMemberRepository } from '../src/modules/member/domain/repositories/member.repository.interface';
import { IBorrowingRepository } from '../src/modules/borrowing/domain/repositories/borrowing.repository.interface';
import { Book } from '../src/modules/book/domain/entities/book.entity';
import { Member } from '../src/modules/member/domain/entities/member.entity';
import { Borrowing } from '../src/modules/borrowing/domain/entities/borrowing.entity';

function mockBookRepo(): jest.Mocked<IBookRepository> {
  return {
    findAll: jest.fn(),
    findByCode: jest.fn(),
    count: jest.fn(),
    save: jest.fn(),
    saveMany: jest.fn(),
  };
}

function mockMemberRepo(): jest.Mocked<IMemberRepository> {
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

describe('BorrowingService', () => {
  let service: BorrowingService;
  let bookRepo: jest.Mocked<IBookRepository>;
  let memberRepo: jest.Mocked<IMemberRepository>;
  let borrowingRepo: jest.Mocked<IBorrowingRepository>;

  beforeEach(() => {
    bookRepo = mockBookRepo();
    memberRepo = mockMemberRepo();
    borrowingRepo = mockBorrowingRepo();
    service = new BorrowingService(bookRepo, memberRepo, borrowingRepo, new BorrowingDomainService());
  });

  describe('borrowBook', () => {
    it('should successfully borrow a book', async () => {
      const member = Object.assign(new Member(), { code: 'M001', name: 'Angga', penaltyEndDate: null });
      const book = Object.assign(new Book(), { code: 'JK-45', title: 'Harry Potter', stock: 1 });

      memberRepo.findByCode.mockResolvedValue(member);
      bookRepo.findByCode.mockResolvedValue(book);
      borrowingRepo.findActiveBorrowsByMember.mockResolvedValue([]);
      borrowingRepo.findActiveBorrowByBook.mockResolvedValue(null);
      borrowingRepo.save.mockImplementation(async (b) => b);

      const result = await service.borrowBook({ memberCode: 'M001', bookCode: 'JK-45' });

      expect(result.memberCode).toBe('M001');
      expect(result.bookCode).toBe('JK-45');
      expect(borrowingRepo.save).toHaveBeenCalled();
    });

    it('should throw when member does not exist', async () => {
      memberRepo.findByCode.mockResolvedValue(null);
      await expect(service.borrowBook({ memberCode: 'INVALID', bookCode: 'JK-45' }))
        .rejects.toThrow('tidak ditemukan');
    });

    it('should throw when book does not exist', async () => {
      memberRepo.findByCode.mockResolvedValue(Object.assign(new Member(), { code: 'M001' }));
      bookRepo.findByCode.mockResolvedValue(null);
      await expect(service.borrowBook({ memberCode: 'M001', bookCode: 'INVALID' }))
        .rejects.toThrow('tidak ditemukan');
    });
  });

  describe('returnBook', () => {
    it('should successfully return a book', async () => {
      const member = Object.assign(new Member(), { code: 'M001', name: 'Angga', penaltyEndDate: null });
      const borrowing = Object.assign(new Borrowing(), {
        memberCode: 'M001',
        bookCode: 'JK-45',
        borrowedAt: new Date(),
        returnedAt: null,
      });

      memberRepo.findByCode.mockResolvedValue(member);
      borrowingRepo.findActiveBorrowByMemberAndBook.mockResolvedValue(borrowing);
      borrowingRepo.save.mockImplementation(async (b) => b);

      const result = await service.returnBook({ memberCode: 'M001', bookCode: 'JK-45' });

      expect(result.memberCode).toBe('M001');
      expect(result.bookCode).toBe('JK-45');
      expect(result.penalized).toBe(false);
    });

    it('should throw when no active borrow found', async () => {
      memberRepo.findByCode.mockResolvedValue(Object.assign(new Member(), { code: 'M001' }));
      borrowingRepo.findActiveBorrowByMemberAndBook.mockResolvedValue(null);

      await expect(service.returnBook({ memberCode: 'M001', bookCode: 'JK-45' }))
        .rejects.toThrow('tidak sedang meminjam');
    });

    it('should apply penalty when returned after 7 days', async () => {
      const member = Object.assign(new Member(), { code: 'M001', name: 'Angga', penaltyEndDate: null });
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      const borrowing = Object.assign(new Borrowing(), {
        memberCode: 'M001',
        bookCode: 'JK-45',
        borrowedAt: tenDaysAgo,
        returnedAt: null,
      });

      memberRepo.findByCode.mockResolvedValue(member);
      borrowingRepo.findActiveBorrowByMemberAndBook.mockResolvedValue(borrowing);
      borrowingRepo.save.mockImplementation(async (b) => b);
      memberRepo.save.mockImplementation(async (m) => m);

      const result = await service.returnBook({ memberCode: 'M001', bookCode: 'JK-45' });

      expect(result.penalized).toBe(true);
      expect(result.penaltyEndDate).not.toBeNull();
      expect(memberRepo.save).toHaveBeenCalled();
    });
  });
});
