import { DataSource } from 'typeorm';
import { BookTypeOrmRepository } from './modules/book/infrastructure/repositories/book.typeorm-repository';
import { MemberTypeOrmRepository } from './modules/member/infrastructure/repositories/member.typeorm-repository';
import { BorrowingTypeOrmRepository } from './modules/borrowing/infrastructure/repositories/borrowing.typeorm-repository';
import { BookService } from './modules/book/application/services/book.service';
import { MemberService } from './modules/member/application/services/member.service';
import { BorrowingService } from './modules/borrowing/application/services/borrowing.service';
import { BorrowingDomainService } from './modules/borrowing/domain/services/borrowing-domain.service';
import { createBookRouter } from './modules/book/interfaces/book.router';
import { createMemberRouter } from './modules/member/interfaces/member.router';
import { createBorrowingRouter } from './modules/borrowing/interfaces/borrowing.router';
import { Router } from 'express';

export function createContainer(dataSource: DataSource) {
  const bookRepository = new BookTypeOrmRepository(dataSource);
  const memberRepository = new MemberTypeOrmRepository(dataSource);
  const borrowingRepository = new BorrowingTypeOrmRepository(dataSource);

  const borrowingDomainService = new BorrowingDomainService();

  const bookService = new BookService(bookRepository, borrowingRepository);
  const memberService = new MemberService(memberRepository, borrowingRepository);
  const borrowingService = new BorrowingService(
    bookRepository,
    memberRepository,
    borrowingRepository,
    borrowingDomainService,
  );

  const bookRouter = createBookRouter(bookService);
  const memberRouter = createMemberRouter(memberService);
  const borrowingRouter = createBorrowingRouter(borrowingService);

  return { bookRouter, memberRouter, borrowingRouter };
}

export function mountRoutes(apiRouter: Router, container: ReturnType<typeof createContainer>) {
  apiRouter.use('/books', container.bookRouter);
  apiRouter.use('/members', container.memberRouter);
  apiRouter.use('/borrowings', container.borrowingRouter);
}
