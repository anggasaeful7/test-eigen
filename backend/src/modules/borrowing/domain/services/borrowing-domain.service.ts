import { Member } from '../../../member/domain/entities/member.entity';
import { Borrowing } from '../entities/borrowing.entity';

const MAX_BORROW_LIMIT = 2;
const PENALTY_THRESHOLD_DAYS = 7;
const PENALTY_DURATION_DAYS = 3;

export class BorrowingDomainService {
  validateBorrow(member: Member, activeBorrowings: Borrowing[], bookAlreadyBorrowed: boolean): void {
    if (member.penaltyEndDate && new Date(member.penaltyEndDate) > new Date()) {
      const endDate = new Date(member.penaltyEndDate).toISOString().split('T')[0];
      throw new Error(`Member ${member.code} sedang dalam masa penalty sampai ${endDate}`);
    }

    if (activeBorrowings.length >= MAX_BORROW_LIMIT) {
      throw new Error(`Member ${member.code} sudah meminjam ${MAX_BORROW_LIMIT} buku`);
    }

    if (bookAlreadyBorrowed) {
      throw new Error('Buku sedang dipinjam oleh member lain');
    }
  }

  createBorrowing(memberCode: string, bookCode: string): Borrowing {
    const borrowing = new Borrowing();
    borrowing.memberCode = memberCode;
    borrowing.bookCode = bookCode;
    borrowing.borrowedAt = new Date();
    borrowing.returnedAt = null;
    return borrowing;
  }

  processReturn(borrowing: Borrowing, member: Member): { borrowing: Borrowing; penalized: boolean } {
    const now = new Date();
    borrowing.returnedAt = now;

    const diffMs = now.getTime() - new Date(borrowing.borrowedAt).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let penalized = false;
    if (diffDays > PENALTY_THRESHOLD_DAYS) {
      const penaltyEnd = new Date(now);
      penaltyEnd.setDate(penaltyEnd.getDate() + PENALTY_DURATION_DAYS);
      member.penaltyEndDate = penaltyEnd;
      penalized = true;
    }

    return { borrowing, penalized };
  }
}
