import { MemberService } from '../src/modules/member/application/services/member.service';
import { IMemberRepository } from '../src/modules/member/domain/repositories/member.repository.interface';
import { IBorrowingRepository } from '../src/modules/borrowing/domain/repositories/borrowing.repository.interface';
import { Member } from '../src/modules/member/domain/entities/member.entity';
import { Borrowing } from '../src/modules/borrowing/domain/entities/borrowing.entity';

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

describe('MemberService', () => {
  let service: MemberService;
  let memberRepo: jest.Mocked<IMemberRepository>;
  let borrowingRepo: jest.Mocked<IBorrowingRepository>;

  beforeEach(() => {
    memberRepo = mockMemberRepo();
    borrowingRepo = mockBorrowingRepo();
    service = new MemberService(memberRepo, borrowingRepo);
  });

  it('should return members with borrowed books count', async () => {
    const members = [
      Object.assign(new Member(), { code: 'M001', name: 'Angga', penaltyEndDate: null }),
      Object.assign(new Member(), { code: 'M002', name: 'Ferry', penaltyEndDate: null }),
    ];

    const borrowing = Object.assign(new Borrowing(), {
      memberCode: 'M001',
      bookCode: 'JK-45',
      borrowedAt: new Date(),
      returnedAt: null,
    });

    memberRepo.findAll.mockResolvedValue(members);
    borrowingRepo.findActiveBorrowsByMember
      .mockResolvedValueOnce([borrowing])
      .mockResolvedValueOnce([]);

    const result = await service.getMembers();

    expect(result).toHaveLength(2);
    expect(result[0].borrowedBooksCount).toBe(1);
    expect(result[1].borrowedBooksCount).toBe(0);
  });

  it('should return empty array when no members exist', async () => {
    memberRepo.findAll.mockResolvedValue([]);
    const result = await service.getMembers();
    expect(result).toHaveLength(0);
  });
});
