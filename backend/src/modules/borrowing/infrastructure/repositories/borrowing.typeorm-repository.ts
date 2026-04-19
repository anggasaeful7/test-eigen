import { Repository, DataSource, IsNull } from 'typeorm';
import { Borrowing } from '../../domain/entities/borrowing.entity';
import { IBorrowingRepository } from '../../domain/repositories/borrowing.repository.interface';

export class BorrowingTypeOrmRepository implements IBorrowingRepository {
  private repository: Repository<Borrowing>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Borrowing);
  }

  async findActiveBorrowByBook(bookCode: string): Promise<Borrowing | null> {
    return this.repository.findOne({
      where: { bookCode, returnedAt: IsNull() },
    });
  }

  async findActiveBorrowsByMember(memberCode: string): Promise<Borrowing[]> {
    return this.repository.find({
      where: { memberCode, returnedAt: IsNull() },
    });
  }

  async findActiveBorrowByMemberAndBook(memberCode: string, bookCode: string): Promise<Borrowing | null> {
    return this.repository.findOne({
      where: { memberCode, bookCode, returnedAt: IsNull() },
    });
  }

  async countActiveBorrowsByBook(bookCode: string): Promise<number> {
    return this.repository.count({
      where: { bookCode, returnedAt: IsNull() },
    });
  }

  async save(borrowing: Borrowing): Promise<Borrowing> {
    return this.repository.save(borrowing);
  }
}
