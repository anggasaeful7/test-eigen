import { Repository, DataSource } from 'typeorm';
import { Member } from '../../domain/entities/member.entity';
import { IMemberRepository } from '../../domain/repositories/member.repository.interface';

export class MemberTypeOrmRepository implements IMemberRepository {
  private repository: Repository<Member>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(Member);
  }

  async findAll(): Promise<Member[]> {
    return this.repository.find();
  }

  async findByCode(code: string): Promise<Member | null> {
    return this.repository.findOne({ where: { code } });
  }

  async count(): Promise<number> {
    return this.repository.count();
  }

  async save(member: Member): Promise<Member> {
    return this.repository.save(member);
  }

  async saveMany(members: Member[]): Promise<Member[]> {
    return this.repository.save(members);
  }
}
