import { BorrowingDomainService } from '../src/modules/borrowing/domain/services/borrowing-domain.service';
import { Member } from '../src/modules/member/domain/entities/member.entity';
import { Borrowing } from '../src/modules/borrowing/domain/entities/borrowing.entity';

function createMember(overrides: Partial<Member> = {}): Member {
  const member = new Member();
  member.id = 1;
  member.code = 'M001';
  member.name = 'Angga';
  member.penaltyEndDate = null;
  return Object.assign(member, overrides);
}

function createBorrowing(overrides: Partial<Borrowing> = {}): Borrowing {
  const borrowing = new Borrowing();
  borrowing.id = 1;
  borrowing.memberCode = 'M001';
  borrowing.bookCode = 'JK-45';
  borrowing.borrowedAt = new Date();
  borrowing.returnedAt = null;
  return Object.assign(borrowing, overrides);
}

describe('BorrowingDomainService', () => {
  let service: BorrowingDomainService;

  beforeEach(() => {
    service = new BorrowingDomainService();
  });

  describe('validateBorrow', () => {
    it('should pass when member has no penalty, less than 2 borrows, and book is available', () => {
      const member = createMember();
      expect(() => service.validateBorrow(member, [], false)).not.toThrow();
    });

    it('should reject when member is penalized', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const member = createMember({ penaltyEndDate: tomorrow });

      expect(() => service.validateBorrow(member, [], false)).toThrow('penalty');
    });

    it('should reject when member already has 2 active borrows', () => {
      const member = createMember();
      const borrows = [createBorrowing(), createBorrowing({ id: 2, bookCode: 'SHR-1' })];

      expect(() => service.validateBorrow(member, borrows, false)).toThrow('2 buku');
    });

    it('should reject when book is already borrowed', () => {
      const member = createMember();
      expect(() => service.validateBorrow(member, [], true)).toThrow('dipinjam');
    });

    it('should allow borrow when penalty has expired', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const member = createMember({ penaltyEndDate: yesterday });

      expect(() => service.validateBorrow(member, [], false)).not.toThrow();
    });
  });

  describe('createBorrowing', () => {
    it('should create a borrowing with correct member and book codes', () => {
      const result = service.createBorrowing('M001', 'JK-45');

      expect(result.memberCode).toBe('M001');
      expect(result.bookCode).toBe('JK-45');
      expect(result.borrowedAt).toBeInstanceOf(Date);
      expect(result.returnedAt).toBeNull();
    });
  });

  describe('processReturn', () => {
    it('should not penalize when returned within 7 days', () => {
      const borrowing = createBorrowing({
        borrowedAt: new Date(),
      });
      const member = createMember();

      const { penalized } = service.processReturn(borrowing, member);

      expect(penalized).toBe(false);
      expect(member.penaltyEndDate).toBeNull();
      expect(borrowing.returnedAt).toBeInstanceOf(Date);
    });

    it('should penalize when returned after more than 7 days', () => {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      const borrowing = createBorrowing({ borrowedAt: tenDaysAgo });
      const member = createMember();

      const { penalized } = service.processReturn(borrowing, member);

      expect(penalized).toBe(true);
      expect(member.penaltyEndDate).toBeInstanceOf(Date);
      expect(member.penaltyEndDate!.getTime()).toBeGreaterThan(new Date().getTime());
    });
  });
});
