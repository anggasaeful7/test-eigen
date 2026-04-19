import { Member } from '../entities/member.entity';

export interface IMemberRepository {
  findAll(): Promise<Member[]>;
  findByCode(code: string): Promise<Member | null>;
  count(): Promise<number>;
  save(member: Member): Promise<Member>;
  saveMany(members: Member[]): Promise<Member[]>;
}
