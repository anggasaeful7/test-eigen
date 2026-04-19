import { IBookRepository } from '../../../book/domain/repositories/book.repository.interface';
import { IMemberRepository } from '../../../member/domain/repositories/member.repository.interface';
import { IBorrowingRepository } from '../../domain/repositories/borrowing.repository.interface';
import { BorrowingDomainService } from '../../domain/services/borrowing-domain.service';
import { BorrowBookDto } from '../dto/borrow-book.dto';
import { ReturnBookDto } from '../dto/return-book.dto';

export class BorrowingService {
  constructor(
    private bookRepository: IBookRepository,
    private memberRepository: IMemberRepository,
    private borrowingRepository: IBorrowingRepository,
    private domainService: BorrowingDomainService,
  ) {}

  async borrowBook(dto: BorrowBookDto) {
    const member = await this.memberRepository.findByCode(dto.memberCode);
    if (!member) {
      throw new Error(`Member dengan code ${dto.memberCode} tidak ditemukan`);
    }

    const book = await this.bookRepository.findByCode(dto.bookCode);
    if (!book) {
      throw new Error(`Buku dengan code ${dto.bookCode} tidak ditemukan`);
    }

    const activeBorrowings = await this.borrowingRepository.findActiveBorrowsByMember(dto.memberCode);
    const existingBorrow = await this.borrowingRepository.findActiveBorrowByBook(dto.bookCode);
    const bookAlreadyBorrowed = existingBorrow !== null;

    this.domainService.validateBorrow(member, activeBorrowings, bookAlreadyBorrowed);

    const borrowing = this.domainService.createBorrowing(dto.memberCode, dto.bookCode);
    await this.borrowingRepository.save(borrowing);

    return {
      memberCode: dto.memberCode,
      bookCode: dto.bookCode,
      borrowedAt: borrowing.borrowedAt,
    };
  }

  async returnBook(dto: ReturnBookDto) {
    const member = await this.memberRepository.findByCode(dto.memberCode);
    if (!member) {
      throw new Error(`Member dengan code ${dto.memberCode} tidak ditemukan`);
    }

    const borrowing = await this.borrowingRepository.findActiveBorrowByMemberAndBook(dto.memberCode, dto.bookCode);
    if (!borrowing) {
      throw new Error(`Member ${dto.memberCode} tidak sedang meminjam buku ${dto.bookCode}`);
    }

    const { penalized } = this.domainService.processReturn(borrowing, member);

    await this.borrowingRepository.save(borrowing);
    if (penalized) {
      await this.memberRepository.save(member);
    }

    return {
      memberCode: dto.memberCode,
      bookCode: dto.bookCode,
      returnedAt: borrowing.returnedAt,
      penalized,
      penaltyEndDate: penalized ? member.penaltyEndDate : null,
    };
  }
}
