import { IMemberRepository } from '../../domain/repositories/member.repository.interface';
import { IBorrowingRepository } from '../../../borrowing/domain/repositories/borrowing.repository.interface';
import { MemberResponseDto } from '../dto/member-response.dto';

export class MemberService {
  constructor(
    private memberRepository: IMemberRepository,
    private borrowingRepository: IBorrowingRepository,
  ) {}

  async getMembers(): Promise<MemberResponseDto[]> {
    const members = await this.memberRepository.findAll();

    const result: MemberResponseDto[] = [];
    for (const member of members) {
      const activeBorrows = await this.borrowingRepository.findActiveBorrowsByMember(member.code);
      result.push({
        code: member.code,
        name: member.name,
        penaltyEndDate: member.penaltyEndDate,
        borrowedBooksCount: activeBorrows.length,
      });
    }

    return result;
  }
}
