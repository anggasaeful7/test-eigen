import { Borrowing } from '../entities/borrowing.entity';

export interface IBorrowingRepository {
  findActiveBorrowByBook(bookCode: string): Promise<Borrowing | null>;
  findActiveBorrowsByMember(memberCode: string): Promise<Borrowing[]>;
  findActiveBorrowByMemberAndBook(memberCode: string, bookCode: string): Promise<Borrowing | null>;
  countActiveBorrowsByBook(bookCode: string): Promise<number>;
  save(borrowing: Borrowing): Promise<Borrowing>;
}
